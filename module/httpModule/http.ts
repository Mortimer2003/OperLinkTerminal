import axios, { AxiosHeaders } from "axios";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { Enterprise, Server, User } from "../dataModule/types";
import { err } from "react-native-svg/lib/typescript/xml";
import { resolve } from "react-native-svg/lib/typescript/lib/resolve";
import { loadData, saveData } from "../../App";
import storage from "../dataModule/storage";

const jwt = require("jsonwebtoken");

//user jwt
let token: any;
storage.load({ key: 'TOKEN' })
  .then(ret => {token=ret})
  .catch(err => {
    storage.save({ key: 'TOKEN', data: null });
    token = null;
  });

const defaultCount=20

// let httpRequest: XMLHttpRequest
//
// function alertContents() {
//   if (httpRequest.readyState === XMLHttpRequest.DONE) {
//     if (httpRequest.status === 200) {
//       console.log(httpRequest.responseText);
//       // resolve(JSON.parse(httpRequest.responseText))
//     } else {
//       console.log("request error!");
//       //reject(new Error('request error!'))
//       // resolve(null)
//     }
//   }
// }

/*—————————————————————————————————————用户相关API———————————————————————————————————————*/

export const register = async (phone:string,password:string,code:string,avatar:string,nickname?:string,username?:string) => {

    return new Promise((resolve, reject) =>{
      axios.post('/api/user/register',{
          phone:phone,
          password:password,
          code:code,
          avatar:avatar,
          nickname:nickname,
          username:username
      }).then(response => {
        const payload = response.data;
        if(payload==='注册成功'){
          alert("注册成功！");
          resolve(true);
        }
        else{
          alert("注册失败！");
          resolve(false);
        }
      }).catch(error =>{
        alert("register error！");
        console.log("catch register error！", error);
        reject(error);
      })
    });

}

export const login = async (identity:string,password?:string,code?:string) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/user/login', {
        identity:identity,
        password:password,
        code:code
    }).then(response => {
      token = response.data;
      saveData('TOKEN',token)
      if(token){
        //TODO:需要解析userJWT获取用户信息
        alert("登录成功！");
        resolve(true);
      }
      else{
        alert("登录失败！");
        resolve(false);
      }
    }).catch(error =>{
      alert("login error！");
      console.log("catch login error！", error);
      reject(error);
    })
  });
}

export const sendCode = async (phone: string) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/user/sendCode', {
      phone:phone
    }).then(response => {
      // TODO: 调整验证码失效时间
      resolve({code:response.data.code, time: 5 * 60 * 1000});
    }).catch(error =>{
      alert("sendCode error！");
      console.log("catch sendCode error！", error);
      reject(error);
    })
  });
}

//函数工厂
function updateFunctionFactory (funcName:string, paramNames: string[], subjectChinese:string){
  return async function (...args: any[]) {
    // 构造参数对象
    const params = args.reduce((obj, arg, index) => {
      obj[paramNames[index]] = arg;
      return obj;
    }, {});

    return new Promise<boolean>((resolve, reject) => {
      axios.post(`/api/user/${funcName}`, params, {
        headers: {
          'Authorization': 	'Bearer ' + token
        }
      }).then(
        response => {
          if(response.data==="修改成功"){
            alert(`${subjectChinese}修改成功！`);
            resolve(true);
          } else {
            alert(`${subjectChinese}修改失败！`);
            resolve(false);
          }
      }).catch(error =>{
        alert(`${funcName} error！`);
        console.log(`catch ${funcName} error！`, error);
        reject(error);
      })
    });
  }
}

export const updatePassword:(oPassword:string, nPassword:string)=>Promise<boolean> =
  updateFunctionFactory('updatePassword',['oPassword','nPassword'],'密码')
export const updateNickname:(nickname:string)=>Promise<boolean> =
  updateFunctionFactory('updateNickname',['nickname'],'昵称')
export const updatePhone:(nPhone:string, code:string)=>Promise<boolean> =
  updateFunctionFactory('updatePhone',['nPhone','code'],'手机号')

export const changeEnterprise:(enterpriseId:string)=>Promise<{type:string, users:User[], enterprise:Enterprise}> = async (enterpriseId:string) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/user/changeEnterprise', {
      enterpriseId:enterpriseId
    }, {
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      const {type, users, enterprise} = response.data;
      alert(`切换企业成功！`);
      //TODO：存储当前企业信息
      resolve({type, users, enterprise})
    }).catch(error =>{
      alert("changeEnterprise error！");
      console.log("catch changeEnterprise error！", error);
      reject(error);
    })
  });
}

/*—————————————————————————————————————上传相关API———————————————————————————————————————*/

export const uploadImage = async (file: FormData) => {

  return new Promise<string>((resolve, reject) =>{
    axios.post('/api/upload',{
      file: FormData
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      const resourceUrl = response.data.resourceUrl;
      alert(`图片上传成功！`);
      resolve(resourceUrl); //返回图片地址(未缓存图片，只缓存了地址)
    }).catch(error =>{
      alert("uploadImage error！");
      console.log("catch uploadImage error！", error);
      reject(error);
    })
  });

}

/*—————————————————————————————————————企业相关API———————————————————————————————————————*/
//TODO:未调用
//权限：超级管理员
export const authAdmin = async (enterpriseId:string, userId:string, type: number, state:number) => {

  return new Promise<boolean>((resolve, reject) =>{
    axios.post('/api/sudo/authAdmin',{
      enterpriseId:enterpriseId,
      userId:userId,
      type:type,
      state:state
    }).then(response => {
      const payload = response.data;
      if(payload==="授权成功"){
        alert("操作成功！");
        resolve(true);
      }
      else{
        alert("操作失败！");
        resolve(false);
      }
    }).catch(error =>{
      if (error.response && error.response.status === 500 && error.response.data==="权限不足") {
        // 处理 500 错误
        alert("权限不足！");
        resolve(false);
      } else {
        alert("authAdmin error！");
        console.log("catch authAdmin error！", error);
        reject(error);
      }
    })
  });
}

//创建者即为超级管理员
export const createEnterprise = async (name:string, creditCode:string, bLicense:string, legalName:string, description:string, IDCard:string) => {

  return new Promise<boolean>((resolve, reject) =>{
    axios.post('/api/sudo/createEnterprise',{
      name:name,
      creditCode:creditCode,
      bLicense:bLicense,
      legalName:legalName,
      description:description,
      IDCard:IDCard
    }).then(response => {
      const payload = response.data;
      if(payload==="创建成功"){
        alert("创建成功！");
        resolve(true);
      }
      else{
        alert("创建失败！");
        resolve(false);
      }
    }).catch(error =>{
      if (error.response && error.response.status === 500 && error.response.data==="该企业已存在") {
        // 处理 500 错误
        alert("该企业已存在！");
        resolve(false);
      } else {
        alert("createEnterprise error！");
        console.log("catch createEnterprise error！", error);
        reject(error);
      }
    })
  });
}

export const getEnterprises = async (offset:number=0,/* count?:number, */search?:string) => {

  return new Promise<Enterprise[]>((resolve, reject) =>{
    axios.get('/api/sudo/getEnterprises', { params:{
        offset:offset*defaultCount,
        count:defaultCount,
        search:search
    }}).then(response => {
      resolve(response.data.enterpriseList) // Enterprise[]
    }).catch(error =>{
      alert("getEnterprises error！");
      console.log("catch getEnterprises error！", error);
      reject(error);
    })
  });
}

//TODO:未调用
export const getEnterprise = async (enterpriseId: string) => {

  return new Promise<Enterprise>((resolve, reject) =>{
    axios.get('/api/sudo/getEnterprise',{ params:{
        enterpriseId:enterpriseId
    }}).then(response => {
      resolve(response.data) // Enterprise
    }).catch(error =>{
      alert("getEnterprise error！");
      console.log("catch getEnterprise error！", error);
      reject(error);
    })
  });
}

export const getUsers = async (enterpriseId:string,offset:number=0,state?:number,/*count:number=20,*/) => {

  let end=false;
  // const promises = states.map(state => {
  //   // 每个state都返回一个执行axios请求的Promise
  //   return axios.get('/api/sudo/getUsers', {
  //     params: {
  //       enterpriseId: enterpriseId,
  //       state: state,
  //       offset: offset * defaultCount,
  //       count: defaultCount
  //     }
  //   }).then(response => {
  //     // 直接返回需要的数据部分
  //     isComplete = response.data.users.length < defaultCount;
  //     return response.data.users; // User[]
  //   });
  // });

  return new Promise<{items: Array<User&{state:number}>,end:boolean}>((resolve, reject) =>{

      axios.get('/api/sudo/getUsers',{ params:{
          enterpriseId: enterpriseId,
          state: state,
          offset: offset * defaultCount,
          count: defaultCount
        }
      }).then(response => {
        end = response.data.users.length < defaultCount;
        resolve({items: response.data.users.map((user: any)=>new Object({...user, state:state})),end}) // User[]
      }).catch(error =>{
        alert("getUsers error！");
        console.log("catch getUsers error！", error);
        reject(error);
      })
    });



}

//权限：超级管理员
export const getApplications = async (enterpriseId: string) => {

  return new Promise<Array<User&{state:number}>>((resolve, reject) =>{
    axios.get('/api/sudo/getApplications',{ params:{
        enterpriseId:enterpriseId,
    }}).then(response => {
      resolve(response.data.users.map((user: any)=>new Object({...user, state:2}))) // User[]
    }).catch(error =>{
      alert("getApplications error！");
      console.log("catch getApplications error！", error);
      reject(error);
    })
  });
}

export const applyEnterprise = async (enterpriseId: string) => {

  return new Promise((resolve, reject) =>{
    axios.post('/api/sudo/applyEnterprise',{
      enterpriseId:enterpriseId
    },{
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      const payload = response.data;
      if(payload==="成功申请"){
        alert("申请成功！");
        resolve(true);
      }
      else{
        alert("申请失败！");
        resolve(false);
      }

    }).catch(error =>{
      alert("applyEnterprise error！");
      console.log("catch applyEnterprise error！", error);
      reject(error);
    })
  });
}

export const getUserEnterprises = async (userId: string, offset:number=0,/*count:number=20,*/state?:number) => {

  return new Promise<Enterprise[]>((resolve, reject) => {
    axios.get('/api/sudo/getUserEnterprises',{ params:{
      userId:userId,
      state:state,
      offset:offset*defaultCount,
      count:defaultCount
    }}).then(response => {
      resolve(response.data.enterpriseList) // Enterprise[]
    }).catch(error => {
      alert("getUserEnterprises error！");
      console.log("catch getUserEnterprises error！", error);
      reject(error);
    })
  });
}


/*—————————————————————————————————————终端相关API———————————————————————————————————————*/

export const connectInit = async (host:string, username:string, password:string) => {
  return new Promise<string>((resolve, reject) => {
    axios.post('/api/terminal/initConnect', {
      host: host,
      username: username,
      password: password
    }).then(response => {
      const {has_error, message, SSHSessionID} = response.data;
      if(has_error){
        // alert("连接失败！");
        reject(message);
      }
      else resolve(SSHSessionID);
    }).catch(error => {
      alert("connectInit error！");
      console.log("catch connectInit error！", error);
      reject(error);
    });
  });
};

//TODO: websocket接口待处理
// export const sshConnect = (SSHSessionID: string) => {
//   const ws = new WebSocket('/api/terminal/sshConnect');
//
//   // 函数用于发送消息
//   const sendMessage = (data: string) => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(data);
//     } else {
//       console.error("WebSocket is not open.");
//     }
//   };
//
//   // 设置 WebSocket 的 onopen 事件处理程序以发送 SSHSessionID
//   ws.onopen = () => {
//     sendMessage(SSHSessionID);
//   };
//
//   // 设置一个错误处理函数
//   ws.onerror = (error) => {
//     console.log('WebSocket error: ', error);
//   };
//
//   // 返回一个对象，包含 sendMessage 函数和一个设置消息处理函数的方法
//   return {
//     sendMessage,
//     onMessage: (callback: (data: string) => void) => {
//       ws.onmessage = (event) => callback(event.data);
//     }
//   };
// };


export const createConnect = async (ip:string,port:number,password:string,username:string,enterpriseId:string, nickname:string) => {
  return new Promise<boolean>((resolve, reject) => {

    axios.post('/api/terminal/createConnect', {
      ip: ip,
      port: port,
      password: password,
      username: username,
      enterpriseId: enterpriseId,
      nickname:  nickname,
    }, {
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      const payload = response.data;
      if(payload==="新建成功"){
        alert("新建成功！");
        resolve(true);
      }
      else{
        alert("新建失败！");
        resolve(false);
      }
    }).catch(error => {
      alert("createConnect error！");
      console.log("catch createConnect error！", error);
      reject(error);
    });
  });
};

// TODO: 什么时候用？
export const getServerInfo = async (enterpriseId:string,serverId:string) => {
  return new Promise((resolve, reject) => {
    axios.get('/api/termianl/getServerInfo', {
      params: {
        enterpriseId: enterpriseId,
        serverId: serverId
      },
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      resolve(response.data.server);
    }).catch(error => {
      alert("getServerInfo error！");
      console.log("catch getServerInfo error！", error);
      reject(error);
    });
  });
};

export const getServers = async (enterpriseId:string, offset:number=0) => {
  return new Promise<{items: Array<Server>,end:boolean}>((resolve, reject) => {
    axios.get('/api/terminal/getServers', {
      params: {
        enterpriseId:enterpriseId,
        offset:offset*defaultCount,
        count:defaultCount
      },
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      resolve({items: response.data.serverList, end:response.data.serverList.length < defaultCount}) // User[]
    }).catch(error => {
      alert("getServers error！");
      console.log("catch getServers error！", error);
      reject(error);
    });
  });
};

export const authServer = async (userId:string, type:number, serverId:string) => {
  return new Promise((resolve, reject) => {
    axios.get('/api/terminal/authServer', {
      params: {
        userId:userId,
        type:type,
        serverId:serverId
      },
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      const payload = response.data;
      if(payload==="授权成功"){
        alert("授权成功！");
        resolve(true);
      }
      else{
        alert("授权失败！");
        resolve(false);
      }
    }).catch(error => {
      alert("authServer error！");
      console.log("catch authServer error！", error);
      reject(error);
    });
  });
};

export const getUserServer = async (userId:string, ) => {
  return new Promise<{items: Array<Server>,end:boolean}>((resolve, reject) => {
    axios.get('/api/terminal/getUserServer', {
      params: {
        userId: userId,
      },
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      resolve({items: response.data.serverList, end:true}) // User[]
    }).catch(error => {
      alert("getUserServer error！");
      console.log("catch getUserServer error！", error);
      reject(error);
    });
  });
};

export const deleteServer = async (serverId:string) => {
  return new Promise<boolean>((resolve, reject) => {
    axios.post('/api/terminal/deleteServer', {
      serverId:serverId
    }, {
      headers: {
        'Authorization': 	'Bearer ' + token
      }
    }).then(response => {
      alert("删除成功！");
      resolve(true);
    }).catch(error => {
      alert("deleteServer error！");
      console.log("catch deleteServer error！", error);
      reject(error);
    });
  });
};

/*—————————————————————————————————————拦截器———————————————————————————————————————*/
/*
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前添加token
  if (token) {
    //将token放到请求头发送给服务器
    config.headers.setAuthorization(token);
  }

  console.log(config)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
*/
