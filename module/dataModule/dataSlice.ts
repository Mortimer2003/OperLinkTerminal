import { HostType, KeyType, SettingType, UserType } from "./types";

export const defaultKeySlice: Array<KeyType> = [
  {
    nickname: "key1",
    type: "RSA",
    digit: 2048,
    password: "123456",
    locked: false,
    keyPair: {
      privateKey: "privateKey",
      publicKey: "publicKey"
    },
    confirmRequired: false
    //ref: React.createRef(),
  }, {
    nickname: "key2",
    type: "ABC",
    digit: 1024,
    password: "",
    locked: true,
    keyPair: {
      privateKey: "privateKey",
      publicKey: "publicKey"
    },
    confirmRequired: true
    //ref: React.createRef(),
  }
];

export const defaultHostSlice: Array<HostType> = [
  {
    connecting: true,
    time: "1696428485712",
    nickname: "主机1",
    color: "black",

    protocol: "ssh",
    encode: "utf-8",
    openShell: true,

    username: "user",
    host: "127.0.0.1",
    port: "80",
    password: "111",

    texts:[]
  },
  {
    connecting: false,
    time: "1696428000000",
    nickname: "主机2",
    color: "black",

    protocol: "ssh",
    encode: "utf-8",
    openShell: false,

    username: "user",
    host: "192.0.0.1",
    port: "80",
    password: "222",

    texts:[]
  },
];

export const defaultSettingSlice: SettingType = {
  recordKey_connect: true,
  keepConnect_connect: true,
  functionKey_keyboard: false
};

export const defaultUserSlice: UserType = {
  id: '',
  nickname: '游客',
  password: '',
  phone: '',
  avatar:  {uri:''},//require('../../assets/defaultAvatar.png'),
  isLogin: false,
  enterprise: null,
  level: 3
}
