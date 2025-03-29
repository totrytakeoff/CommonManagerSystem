<template>

  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model='formInline'>
      <el-form-item label="请输入:">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="table">
    <el-table :data="tableData" stripe style="width: 100%">

      <el-table-column fixed label="序号" width="60">
        <template #default="scope">
          {{ scope.$index + 1 + (config.curPage - 1) * 10 }}
        </template>
      </el-table-column>

      <el-table-column fixed prop="id" label="ID" width="200" />
      <el-table-column v-for="(item, index) in tableLabel" :key="item.prop" :width="item.width ? item.width : 125"
        :label="item.label" :prop="item.prop">

      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #="scope">
          <!-- scope.row是当前行的数据 -->
          <el-button type="primary" size="small" @click='handleEdit(scope.row)'>编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页  -->
    <el-pagination class='pager' background layout="prev,pager,next" size="small" :total="config.total"
      v-model:current-page="config.curPage" @current-change="getUserData(formInline.keyWord)" />



    <!-- 新增 用户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
      :before-close="handleClose">
      <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
      <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="select-clearn" label="性别" prop="sex">
              <el-select v-model="formUser.sex" placeholder="请选择">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="地址" prop="addr">
            <el-input v-model="formUser.addr" placeholder="请输入地址" />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>



  </div>



</template>


<script setup lang="ts">

import { ref, onMounted, nextTick } from 'vue'

import API from '@/api/api.ts'
import type { User, Config } from '@/types.ts'
import { ElMessage, ElMessageBox } from 'element-plus';


// 获取用户数据,传递keyWord参数实现搜索功能
const getUserData = async (keyWord: string) => {

  config.value.name = keyWord;
  await API.getUserData(tableData, config);

}

onMounted(() => {
  getUserData(formInline.value.keyWord);
})

// 搜索button槽函数
const handleSearch = () => {
  getUserData(formInline.value.keyWord);
}

const handleDel = async (val: any) => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });


    // 调用删除接口
    const res: any = await API.deleteUser(val.id);

    console.log("res:", res);


    if (res.code === 200) { // 确保删除成功
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });

      // 刷新用户数据
      getUserData(formInline.value.keyWord);
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败，请重试！'
      });
    }
  } catch (err) {
    // 用户取消删除或接口调用失败
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  }
};

const handleClose = () => {
  dialogVisible.value = false;
  (userForm.value as any).resetFields();
  // 刷新用户数据
  getUserData(formInline.value.keyWord);
}
const handleCancel = () => {
  dialogVisible.value = false;
  (userForm.value as any).resetFields();

  // 刷新用户数据
  getUserData(formInline.value.keyWord);
}

const handleAdd = () => {
  dialogVisible.value = true;
  action.value = 'add';
}

const handleEdit = (val: any) => {

  //表单获取table数据

  dialogVisible.value = true;
  action.value = 'edit';

  //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
  //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
  nextTick(() => { formUser.value = val; })

}

const parseTime = (time: string | number | Date): string => {
  if (!time) return ''; // 如果时间为空，返回空字符串

  const date = new Date(time); // 将输入转换为 Date 对象
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', time);
    return ''; // 如果日期无效，返回空字符串
  }

  const year = date.getFullYear(); // 获取年份
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份，并补零
  const day = String(date.getDate()).padStart(2, '0'); // 获取日期，并补零

  return `${year}-${month}-${day}`; // 返回 "YYYY-MM-DD" 格式的字符串
};


const onSubmit = async () => {
  // 表单验证
  (userForm.value as any).validate(async (valid: boolean) => {
    if (valid) {
      try {

        formUser.value.sex = parseInt(formUser.value.sex as unknown as string);
        formUser.value.birth = parseTime(formUser.value.birth as unknown as string);


        if (action.value === 'add') {
          // 调用新增接口
          await API.addUser(formUser.value);
          ElMessage({
            type: 'success',
            message: '新增成功!',
          });
        } else {
          // 调用编辑接口
          await API.updateUser(formUser.value);
          ElMessage({
            type: 'success',
            message: '编辑成功!',
          });
        }

        // 刷新用户数据
        getUserData(formInline.value.keyWord);

        // 重置表单并关闭弹窗
        dialogVisible.value = false;

        // 重置表单
        (userForm.value as any).resetFields();
      } catch (err) {
        ElMessage({
          type: 'error',
          message: '操作失败，请重试！',
        });
      }
    } else {
      ElMessageBox.alert('请输入正确的信息', '提示', {
        confirmButtonText: '确定',
      });
    }
  });
};


const tableData = ref<User[]>([])
const tableLabel = ref([
  {
    prop: 'name',
    label: '姓名',
    width: 150
  },
  {
    prop: 'age',
    label: '年龄',
    width: 150
  },
  {
    prop: 'sex',
    label: '性别'
  },
  {
    prop: 'addr',
    label: '地址',
    width: 300
  },
  {
    prop: 'birth',
    label: '生日',
    width: 150
  },


])

//用于存储搜索框数据
const formInline = ref({
  keyWord: ''
})

const config = ref<Config>({
  url: '',
  name: '用户',
  total: 0,
  curPage: 1
})

const dialogVisible = ref(false)
const action = ref('add')
const formUser = ref({
  id: '',
  name: '',
  age: 0,
  sex: 0,
  addr: '',
  birth: ''
})

const rules = ref({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'blur' }
  ],
  addr: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  birth: [
    { required: true, message: '请选择日期', trigger: 'blur' }
  ]
})


const userForm = ref<User>({
  id: '',
  name: '',
  age: 0,
  sex: 0,
  addr: '',
  birth: ''
})


</script>


<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
}

.table {
  position: relative;

  .pager {
    position: absolute;
    margin-top: 10px;
    right: 10px;
  }

  .el-table {
    width: 100%;
    height: 500px;
  }

}

.select-clearn {
  display: flex;
}
</style>
