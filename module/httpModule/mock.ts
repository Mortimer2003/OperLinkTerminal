import MockAdapter  from 'axios-mock-adapter';
import Mock from "mockjs";
import axios from "axios";
import { Enterprise, User } from "../dataModule/types";
import { random } from "node-forge";

const mock = new MockAdapter(axios, { delayResponse: 1000 });

Mock.setup({
  timeout: '200-600',// 设置响应时间随机范围
});

const generateEnterpriseArray = (size:number) => {
  return Mock.mock({
    // 生成 size 条数据的数组
    [`data|${size}`]: [
      {
        'id': '@id', // id 递增
        'name': '@ctitle(2, 4)', // 随机生成公司名
        'creditCode': '@guid', // 随机生成一个GUID作为信用代码
        'bLicense': '@word(15)', // 随机生成一个字符串作为营业执照
        'legalName': '@cname(2,3)',
        'description': '@csentence(10, 30)',
        'IDCard': '@id', // 随机生成一个身份证号
      }
    ]
  }).data;
}

const generateUserArray = (size:number) => {
  return Mock.mock({
    // 生成 size 条数据的数组
    [`data|${size}`]: [
      {
        'id': '@id', // id 从 1 开始递增
        'phone': /^1[385][1-9]\d{8}/, // 生成符合特定格式的手机号码
        'password': '@word(6, 12)', // 生成长度为 6 到 12 位的随机字符串作为密码
        'nickname': '@cname', // 生成一个中文名字
        'avatar': '@image("200x200", "@color", "#FFF", "Avatar")', // 生成一张图片的 URL
        'createdAt': '@datetime("T")', // 生成一个 ISO 日期字符串
        'updateAt': '@datetime("T")', // 同上
      }
    ]
  }).data;
}

const enterprises = generateEnterpriseArray(110)
const users = new Map([[1,generateUserArray(110)],[2,generateUserArray(33)],[3,generateUserArray(25)],[4,generateUserArray(0)]])
let hosts = [
  {
    "id": "3611a5d9-4bf9-460a-bf63-8d74e6e89aec",
    "ip": "125.149.227.75",
    "password": "DCa7L@nkF*",
    "port": 64054,
    "username": "stewartjames",
    "enterpriseId": "727a027e-e04f-41d1-9b8c-e959653c5aa2",
    "createdAt": 1707751297,
    "updatedAt": 1707751297,
    "createUserId": "a8b46d04-a8fa-4cdd-bcbb-4669053b0ea1",
    "updateUserId": "8ea7abb6-b533-43f7-989d-294ff5b7cfca",

    'nickname': 'nickname',
    'type': 2
  },
  {
    "id": "5d70bef1-3778-454f-92a4-0d7619d995ed",
    "ip": "182.96.89.191",
    "password": "e9j2IWZp_I",
    "port": 24558,
    "username": "camposmarcus",
    "enterpriseId": "d3fbc2ed-6155-4365-aba9-22995e97b468",
    "createdAt": 1707751297,
    "updatedAt": 1707751297,
    "createUserId": "b73f935f-fce5-4f05-95a1-83b61110f495",
    "updateUserId": "66a3d246-b6db-458b-8bf2-12759c51e2ea",

    'nickname': null,
    'type': 3
  }
]


mock.onPost('/api/sudo/createEnterprise').reply(config => {
  // Extract the data sent in the POST request
  const { name, creditCode, bLicense, IDCard } = JSON.parse(config.data);

  return [200, "创建成功"];
});

mock.onPost('/api/user/changeEnterprise').reply(config => {
  // Extract the data sent in the POST request
  const { enterpriseId } = JSON.parse(config.data);

  return [200, {tye:'2',users:users.get(1),enterprise:{ id: enterpriseId, name: enterprises.find(item => item.id === enterpriseId).name, creditCode: '', bLicense: '', IDCard: '',}}];
});

function moveUserToState(id, newState) {
  let userToMove = null;
  let userIndex = -1;
  let originState = null;

  // 1. 查找并移除用户
  for (const [state, usersArray] of users.entries()) {
    userIndex = usersArray.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      userToMove = usersArray.splice(userIndex, 1)[0]; // 从原数组中移除
      originState = state;
      break;
    }
  }

  // 检查是否找到用户以及新旧状态是否相同
  if (!userToMove || newState === originState) {
    console.log("User not found or already in the target state.");
    return;
  }

  // 2. 将用户添加到新状态对应的数组中
  if (users.has(newState)) {
    users.get(newState).push(userToMove);
  } else {
    console.log("Target state does not exist.");
  }
}


mock.onPost('/api/sudo/authAdmin').reply(config => {
  // Extract the data sent in the POST request
  let { enterpriseId, userId, type, state } = JSON.parse(config.data);

  moveUserToState(userId,state)

  return [200, '授权成功'];
});

mock.onGet('/api/sudo/getUsers').reply(config => {
  // Extract the data sent in the POST request
  let { enterpriseId, state, offset, count } = config.params;
  if(!offset)offset=0;
  if(!count)count=20;
  if(!state)state=1;

  //console.log(users.get(state).slice(offset,offset+count))

  return [200, {users: users.get(state).slice(offset,offset+count)}];
});

mock.onGet('/api/sudo/getApplications').reply(config => {
  // Extract the data sent in the POST request
  //let { enterpriseId, state, offset, count } = config.params;

  return [200, {users: users.get(2)}];
});

mock.onGet('/api/sudo/getEnterprises').reply(config => {
  // 可以从 config.params 中获取请求参数，例如 offset, count, search
  let { offset, count, search } = config.params;
  if(!offset)offset=0;
  if(!count)count=20;

  let filteredEnterprises = enterprises;

  // 如果提供了搜索关键字，则进行过滤
  if (search) {
    filteredEnterprises = enterprises.filter(enterprise =>
      enterprise.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  // 根据 offset 和 count 返回子数组
  const result = filteredEnterprises.slice(offset, offset + count);

  return [200, { enterpriseList: result }];
});

mock.onGet('/api/sudo/getUserEnterprises').reply(config => {
  let { userId, state, offset, count } = config.params;
  if(!offset)offset=0;
  if(!count)count=20;

  return [200, { enterpriseList: enterprises.slice(offset, offset + count) }];
});

mock.onGet('/api/terminal/getServers').reply(config => {
  let { enterpriseId, offset, count } = config.params;
  if(!offset)offset=0;
  if(!count)count=20;

  return [200, { serverList: hosts.slice(offset, offset + count) }];
});

mock.onGet('/api/terminal/getUserServer').reply(config => {
  let { userId } = config.params;

  return [200, { serverList: hosts }];
});

mock.onPost('/api/terminal/authServer').reply(config => {
  // Extract the data sent in the POST request
  const { userId, type } = JSON.parse(config.data);
  //TODO: 更新权限

  return [200, "授权成功"];
});

mock.onPost('/api/terminal/initConnect').reply(config => {
  // Extract the data sent in the POST request

  return [200, { has_error:false, message:'', SSHSessionID:'123456'}];
});

mock.onPost('/api/user/register').reply(config => {
  return [200, '注册成功'];
});

mock.onPost('/api/terminal/createConnect').reply(config => {
  let { ip,port,password,username,enterpriseId, nickname } = JSON.parse(config.data);
  hosts.push({
    id: (hosts.length).toString(),
    ip,
    password,
    port,
    username:username,
    enterpriseId,
    "createdAt": Date.now(),
    "updatedAt": Date.now(),
    "createUserId": "a8b46d04-a8fa-4cdd-bcbb-4669053b0ea1",
    "updateUserId": "8ea7abb6-b533-43f7-989d-294ff5b7cfca",

    nickname: nickname,
    type: 2,
  })
  return [200, '新建成功'];
});

mock.onPost('/api/terminal/deleteServer').reply(config => {
  let { serverId } = JSON.parse(config.data);
  console.log(hosts,serverId)
  hosts=hosts.filter((item)=>item.id!==serverId)
  return [200];
});

mock.onPost('/api/user/sendCode').reply(config => {
  return [200, {code: '1234'}];
});

mock.onPost('/api/upload').reply(config => {
  return [200, {resourceUrl: 'https://images.unsplash.com/photo-1679639539537-0d2e452890f7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}];
});

// mock.onGet("/api/user/register").reply(200,'注册成功');
// mock.onGet("/api/user/login").reply(200, Mock.Random.string(20));

// Mock.mock('/api/auth/register', 'get', {
//   code: 200,
//   data: {
//     error_code: 0,
//     data:null,
//     message:null,
//   },
// });


