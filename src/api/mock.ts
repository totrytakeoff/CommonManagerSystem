import Mock from 'mockjs';

import homeApi from './mock/home';
import userApi from './mock/user';
import permissionApi from './mock/permission';
// 1. 拦截地址 2. 请求方法 3.返回数据

Mock.mock('/api/home/getTableData', 'get', homeApi.getTableData);

Mock.mock('/api/home/getCountData', 'get', homeApi.getCountData);

Mock.mock('/api/home/getChartData', 'get', homeApi.getChartData);

Mock.mock(/api\/user\/getUserData/, 'get', userApi.getUserList);

Mock.mock(/api\/user\/deleteUser/, 'get', userApi.deleteUser);

Mock.mock(/api\/user\/addUser/, 'post', userApi.addUser);

Mock.mock(/api\/user\/updateUser/, 'post', userApi.updateUser);

Mock.mock(/api\/permission\/getMenu/, 'post', permissionApi.getMenu);
