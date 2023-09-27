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
  state: boolean,
  time: string,

  protocol: string,
  name: {
    username: string,
    host: string,
    port: string
  },
  nickname: string,
  color: string,
  encode: string,
  openShell: boolean,
}