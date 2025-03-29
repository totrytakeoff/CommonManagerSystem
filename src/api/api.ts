import axios from 'axios';
import type { Ref } from 'vue';
import type {
    CountData,
    TableData,
    ChartData,
    User,
    Config,
    LoginInfo,
} from '@/types';
// import * as echarts from 'echarts'

export default {
    getCount: async (countData: Ref<CountData[]>) => {
        await axios({
            url: '/api/home/getCountData',
            method: 'get',
        })
            .then((res) => {
                if (res.data.code === 200) {
                    countData.value = res.data.data;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },
    getTableData: async (tableData: Ref<TableData[]>) => {
        await axios({
            url: '/api/home/getTableData',
            method: 'get',
        })
            .then((res) => {
                if (res.data.code === 200) {
                    tableData.value = res.data.data.tableData;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },
    getChartData: async (chartData: Ref<ChartData>) => {
        await axios({
            url: '/api/home/getChartData',
            method: 'get',
        })
            .then((res) => {
                if (res.data.code === 200) {
                    chartData.value = res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    },
    getUserData: async (userData: Ref<User[]>, config: Ref<Config>) => {
        await axios({
            url: `/api/user/getUserData?name=${config.value.name}&page=${config.value.curPage}`,
            method: 'get',
        }).then((res) => {
            if (res.data.code === 200) {
                userData.value = res.data.data.list.map((item: User) => ({
                    ...item,
                    sex: item.sex === 1 ? '男' : '女',
                }));
                config.value.total = res.data.data.count;
            }
        });
    },

    deleteUser: async (id: string) => {
        const response = await axios({
            url: `/api/user/deleteUser?id=${id}`,
            method: 'get',
        });

        if (response.data.code === 200) {
            return response.data; // 显式返回接口响应数据
        }
        return { code: -1, message: '删除失败' }; // 如果失败，返回错误信息
    },
    addUser: async (user: User) => {
        const response = await axios({
            url: '/api/user/addUser',
            method: 'post',
            data: user,
        })
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data;
                }
                return { code: -1, message: '添加失败' };
            })
            .catch((err) => {
                console.log(err);
                return { code: -1, message: '添加失败' };
            });
    },

    updateUser: async (user: User) => {
        const response = await axios({
            url: '/api/user/updateUser',
            method: 'post',
            data: user,
        })
            .then((res) => {
                if (res.data.code === 200) {
                    return res.data;
                }
                return { code: -1, message: '修改失败' };
            })
            .catch((err) => {
                console.log(err);
                return { code: -1, message: '修改失败' };
            });
    },

    getMenu: async (login: LoginInfo): Promise<any> => {
        try {
            const response = await axios({
                url: '/api/permission/getMenu',
                method: 'post',
                data: login,
            });

            if (response.data.code === 200) {
                console.log('getMenu Success: ', response.data);
            } else {
                console.log('getMenu Failed: ', response.data);
            }

            // console.log('getMenu Response: ', response);

            return response.data;
        } catch {
            return { code: -1, message: '获取菜单失败' };
        }
    },
};
