import * as React from "react";
import { useState, createContext, RefObject, useContext, useLayoutEffect, useEffect } from "react";
import { RemoteConnectionPage } from "./RemoteConnection";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewHostPage } from "./NewHost";
import { ManageKeysPage } from "./ManageKeys";
import { SettingsPage } from "./Settings";
import { RemoteOperationPage } from "./RemoteOperation";
import { GenerateKeyPage } from "./GenerateKey";
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AssistancePage } from "./Assistance";
import { saveData, UserContext } from "../../../App";
import { EditHostPage } from "./EditHost";



const HomeStack = createNativeStackNavigator();

// @ts-ignore
export function HomeScreen({ route,navigation }) {
  const { userSlice, setUserSlice } = useContext(UserContext);

  useEffect(() => {

    return navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of going back
      if(!userSlice.isLogin&&e.data.action.type==="POP_TO_TOP")return;

      e.preventDefault();
      //返回直接退出应用
      // console.log(e)
      // console.log(111)
      // console.log(userSlice)//为什么未更新？？？————可能因为使用的是闭包内的useSlice
      BackHandler.exitApp();
      //else if(!userSlice.isLogin&&e.data.action.type==="POP_TO_TOP") navigation.navigate('LoginScreen')//navigation.goBack();
    });
  }, [navigation,userSlice]);

  // useEffect(()=>{
  //   console.log("HomeScreen挂载")
  //   return ()=>{console.log("HomeScreen卸载")}
  // },[])

  return <HomeStack.Navigator initialRouteName={"RemoteConnection"}>
            <HomeStack.Screen name="RemoteConnection" component={RemoteConnectionPage} />
            <HomeStack.Screen name="RemoteOperation" component={RemoteOperationPage} />
            <HomeStack.Screen name="NewHost" component={NewHostPage} />
            <HomeStack.Screen name="EditHost" component={EditHostPage} />
            {/*<HomeStack.Screen name="ManageKeys" component={ManageKeysPage} />*/}
            {/*<HomeStack.Screen name="GenerateKey" component={GenerateKeyPage} />*/}
            <HomeStack.Screen name="Settings" component={SettingsPage} />
            <HomeStack.Screen name="Assistance" component={AssistancePage} />
          </HomeStack.Navigator>
}

