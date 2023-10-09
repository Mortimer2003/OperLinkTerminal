/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import * as React from "react";
import { NavigationContainer, Route } from "@react-navigation/native";
import SplashScreen from "./src/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { LoginScreen } from "./src/LoginScreen";
import { defaultHostSlice, defaultKeySlice, defaultSettingSlice, defaultUserSlice } from "./module/dataSlice";
import storage from "./module/storage";
import { HostType, KeyType, SettingType, UserType } from "./module/types";
import { MainScreen } from "./src/MainScreen";

const contexts={
  KeySlice: defaultKeySlice,
  HostSlice: defaultHostSlice,
  SettingSlice: defaultSettingSlice,
  UserSlice: defaultUserSlice,
}


//考虑到可修改性，直接传引用值而非拷贝值
export const KeyContext = createContext({/*defaultKeySlice*/ });
export const HostContext = createContext({/*defaultHostSlice*/ });
export const SettingContext = createContext({/*defaultSettingSlice*/ });
export const UserContext = createContext({/*defaultUserSlice*/ });

export function loadData(key:string,setData:Function,callback:Function=()=>{}) {
  storage.load({
    key: key,
  })
    .then(ret => {
      setData(ret)
      callback()
    })
    .catch(err => {
      //如果没有找到数据且没有sync方法，
      //或者有其他异常，则在catch中返回
      console.warn(err.message);

      storage.save({
        key: key,
        // @ts-ignore
        data: contexts[key],
      });
    });
}

export function saveData(key:string,newData:KeyType|SettingType|HostType|UserType|Array<any>) {
  storage.save({
    key: key,
    data: newData,
  })
    .then(() => {
      console.log("save",key,newData);
    })
    .catch((err) => {
      console.warn(err.message);
    });
}


const Main = createNativeStackNavigator();


function App() {
  //考虑到可修改性，直接传引用值而非拷贝值
  const [keySlice, setKeySlice] = useState<KeyType[]>(defaultKeySlice);
  const [hostSlice, setHostSlice] = useState<HostType[]>(defaultHostSlice);
  const [settingSlice, setSettingSlice] = useState<SettingType>(defaultSettingSlice);
  const [userSlice, setUserSlice] = useState<UserType>(defaultUserSlice);

  // const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);

  useLayoutEffect(() => {
    // if(!userSlice.isLogin) navigation.navigate('Login');
    // 在组件挂载时从 AsyncStorage 获取数据
    // loadData('UserSlice',setUserSlice) //改为在SplashScreen中获取
    loadData('KeySlice',setKeySlice)
    loadData('HostSlice',setHostSlice)
    loadData('SettingSlice',setSettingSlice)
    // setLoadingCompleted(true)
  }, []);

  return (
    <UserContext.Provider value={{ userSlice, setUserSlice }}>
      <SettingContext.Provider value={{ settingSlice, setSettingSlice }}>
        <KeyContext.Provider value={{ keySlice, setKeySlice }}>
          <HostContext.Provider value={{ hostSlice, setHostSlice }}>
            <NavigationContainer>
              <Main.Navigator initialRouteName="SplashScreen">
                <Main.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} /*initialParams={{ loadingCompleted }}*/ />
                <Main.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                <Main.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
              </Main.Navigator>
            </NavigationContainer>
          </HostContext.Provider>
        </KeyContext.Provider>
      </SettingContext.Provider>
    </UserContext.Provider>
  );
}



export default App;
