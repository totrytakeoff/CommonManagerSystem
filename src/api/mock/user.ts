import Mock from 'mockjs'
import type { User, Config } from '@/types'
// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url: string) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  // 将查询字符串转换为对象
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}',
  )
}

let List: User[] = []
const count = 200
// 模拟200条用户数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(), // 随机生成guid
      name: Mock.Random.cname(), // 随机生成中文名
      addr: Mock.mock('@county(true)'), // 随机生成地址
      'age|18-60': 1, // 随机生成18到60之间的年龄
      birth: Mock.Random.date(), // 随机生成日期
      sex: Mock.Random.integer(0, 1), // 随机生成性别，0或1
    }),
  )
}

export default {
  /**
   * 获取用户列表
   * 需要带参数 name, page, limit; name可以不填, page, limit有默认值。
   * @param config - 请求配置对象，包含url等信息
   * @return {{code: number, data: {list: Array, count: number}}}
   */
  getUserList: (config: Config) => {
    // limit默认是10，因为分页器默认也是一页10个
    const { name, page = 1, limit = 10 } = param2Obj(config.url)

    // 根据name筛选数据
    const mockList = List.filter((user) => {
      if (name && user.name.indexOf(name) === -1) return false
      return true
    })

    // 分页处理
    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1),
    )

    return {
      code: 200,
      data: {
        list: pageList, // 当前页的数据
        count: mockList.length, // 数据总条数
      },
    }
  },

  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: (config: Config) => {
    const { id } = param2Obj(config.url)

    if (!id) {
      return {
        code: -999,
        message: '参数不正确',
      }
    } else {
      List = List.filter((u) => u.id !== id)
      console.log('the list:', List)

      return {
        code: 200,
        message: '删除成功',
      }
    }
  },
  addUser: (data: any) => {
    const user: User = JSON.parse(data.body)
    user.id = Mock.Random.guid()

    List.unshift(user)
    return {
      code: 200,
      message: '添加成功',
    }
  },
  /**
   * 修改用户
   * @param id, name, addr, age, birth, sex
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: (data: any) => {
    const user: User = JSON.parse(data.body)
    console.log('updateUserDATA:', user)
    const { id } = user

    // 修复 findIndex 回调函数，确保返回布尔值
    const idx: number = List.findIndex((u) => u.id === id)
    if (idx !== -1) {
      List[idx] = user
      return {
        code: 200,
        data: {
          message: '编辑成功',
        },
      }
    } else {
      return {
        code: -1,
        message: '用户未找到',
      }
    }
  },
}
