import { HostType, KeyType, SettingType } from "./types";

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
    state: true,
    time: "0分钟前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "127.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: true
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  },
  {
    state: false,
    time: "3天前",

    protocol: "ssh",
    name: {
      username: "user",
      host: "192.0.0.1",
      port: "80"
    },
    nickname: "主机1",
    color: "black",
    encode: "utf-8",
    openShell: false
  }
];

export const defaultSettingSlice: SettingType = {
  recordKey_connect: true,
  keepConnect_connect: true,
  functionKey_keyboard: false
};
