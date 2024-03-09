//后端定义的User表
export type User = {
  id: string,
  phone: string,
  password: string,
  nickname: string,
  avatar: string,
  createdAt: number,
  updateAt: number,
}
//后端定义的Enterprise表
export type Enterprise = {
  id: string,
  name: string,
  creditCode: string,
  bLicense: string,
  IDCard: string,
  description: string,
  legalName: string
}
//后端定义的Server表
export type Server = {
  id:	string
  ip:	string
  password:	string
  port:	number
  username:	string
  enterpriseId:	string
  createdAt:	number
  updatedAt:	number
  createUserId:	string
  updateUserId:	string

  nickname?: string
  type?: 1|2|3
}

export type UserType = {
  id: string,
  nickname: string,
  password: string,
  phone: string,
  avatar: {uri:string} | any,
  isLogin: boolean,
  enterprise: Enterprise | null,
  level: number, //1|2|3, //分别为超级管理员、管理员、普通用户
}

export type SettingType = {
  recordKey_connect: boolean,
  keepConnect_connect: boolean,
  functionKey_keyboard: boolean,
}

export type KeyType = {
  nickname: string,
  type: string,
  digit: number,
  password: string,
  locked: boolean,
  keyPair: {
    privateKey: string,
    publicKey: string,
  },
  confirmRequired: boolean,
}

export type HostType = {
  connecting: boolean, //server没有
  time: number|null,
  nickname: string|null, //server没有
  color: string, //server没有

  protocol: string, //server没有
  encode: string, //server没有
  openShell: boolean, //server没有

  username: string,
  host: string,
  port: string,
  password: string,

  id: string,
  authority: 1|2|3,

  texts: string[] //server没有
}

export const server2host = (server:Server):HostType=>{
  return {
    //TODO:将Server魔改为HostType类型，保留一定的本地存储能力
    connecting: false,
    time: server.updatedAt,
    nickname: server.nickname || null,
    color: "black",

    protocol: "ssh",
    encode: "utf-8",
    openShell: false,

    username: server.username,
    host: server.ip,
    port: server.port.toString(),
    password: server.password,

    id: server.id,
    authority: server.type||3,

    texts: [] //server没有
  }
}
