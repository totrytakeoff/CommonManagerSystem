import Mock from 'mockjs'

import homeApi from './mock/home'
// 1. 拦截地址 2. 请求方法 3.返回数据

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData)

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData)

Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData)
