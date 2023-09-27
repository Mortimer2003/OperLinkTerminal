import * as React from "react";
import { useState, createContext, RefObject, useContext, useLayoutEffect, useEffect } from "react";
import { RemoteConnectionPage } from "./RemoteConnection";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NewConnectionPage } from "./NewConnection";
import { ManageKeysPage } from "./ManageKeys";
import { SettingsPage } from "./Settings";
import { RemoteOperationPage } from "./RemoteOperation";
import { GenerateKeyPage } from "./GenerateKey";
import {
  Button,
  Image,
  Modal,
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { HostType, SettingType, KeyType } from "../../module/types";
import { defaultHostSlice, defaultKeySlice, defaultSettingSlice } from "../../module/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "../../module/storage";
import { useIsFocused, useNavigationState, useRoute } from "@react-navigation/native";
import { AssistancePage } from "./Assistance";

const contexts={
  KeySlice: defaultKeySlice,
  HostSlice: defaultHostSlice,
  SettingSlice: defaultSettingSlice,
}


//考虑到可修改性，直接传引用值而非拷贝值
export const KeyContext = createContext(defaultKeySlice);
export const HostContext = createContext(defaultHostSlice);
export const SettingContext = createContext(defaultSettingSlice);

export function loadData(key:string,setData:Function) {
  storage.load({
    key: key,
  })
    .then(ret => {
      setData(ret)
    })
    .catch(err => {
      //如果没有找到数据且没有sync方法，
      //或者有其他异常，则在catch中返回
      console.warn(err.message);

      storage.save({
        key: key,
        data: contexts[key],
      });
    });
}

export function saveData(key:string,newData:KeyType|SettingType|HostType|Array<any>) {
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

const Stack = createNativeStackNavigator();

// @ts-ignore
export function HomeScreen({ route,navigation }) {

  //考虑到可修改性，直接传引用值而非拷贝值
  const [keySlice, setKeySlice] = useState<KeyType[]>(defaultKeySlice);
  const [hostSlice, setHostSlice] = useState<HostType[]>(defaultHostSlice);
  const [settingSlice, setSettingSlice] = useState<SettingType>(defaultSettingSlice);

  useEffect(() => {
    // 在组件挂载时从 AsyncStorage 获取数据
    loadData('KeySlice',setKeySlice)
    loadData('HostSlice',setHostSlice)
    loadData('SettingSlice',setSettingSlice)
  }, []);


  return <SettingContext.Provider value={{ settingSlice, setSettingSlice }}>
    <KeyContext.Provider value={{ keySlice, setKeySlice }}>
      <HostContext.Provider value={{ hostSlice, setHostSlice }}>
        <Stack.Navigator initialRouteName={"RemoteConnection"}>
          <Stack.Screen name="RemoteConnection" component={RemoteConnectionPage} />
          <Stack.Screen name="NewConnection" component={NewConnectionPage} />
          <Stack.Screen name="RemoteOperation" component={RemoteOperationPage} />
          <Stack.Screen name="ManageKeys" component={ManageKeysPage} />
          <Stack.Screen name="GenerateKey" component={GenerateKeyPage} />
          <Stack.Screen name="Settings" component={SettingsPage} />
          <Stack.Screen name="Assistance" component={AssistancePage} />
        </Stack.Navigator>
      </HostContext.Provider>
    </KeyContext.Provider>
  </SettingContext.Provider>;
}

// @ts-ignore
export const MyHeader = ({ title, leftButton, bottomButton, rightButton, style, }) => (
  <View style={[styles.header, style]}>
    <View style={{ flexDirection: "row", alignItems: 'center' }}>
      <View style={styles.leftButton}>{leftButton}</View>
      <Text style={[styles.headerTitle,rightButton?{left:50}:{textAlign: 'center'}]}>{title}</Text>
      {rightButton && <View style={styles.rightButton}>{rightButton}</View>}
    </View>
    {bottomButton && <View style={styles.bottomButton}>{bottomButton}</View>}
  </View>
);

// @ts-ignore
export const header = ({ navigation, route, options, back }) => {
  const title = options.headerTitle() || route.name;

  return (
    <MyHeader
      title={title}
      leftButton={route.name !== "RemoteConnection" ? (
          <TouchableOpacity onPress={() => {
            // console.log("back")
            navigation.goBack();
          }} >
            <Image style={styles.icon} source={require("../../assets/back.png")} />
          </TouchableOpacity>
        ) : undefined}
      bottomButton={options.headerRight&&options.bottom?options.headerRight():null}
      rightButton={options.headerRight&&!options.bottom?options.headerRight():null}
      style={options.headerStyle || {backgroundColor: 'rgba(118, 118, 118, 0.50)'}}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    width: '90%',
    height: 'auto',
    minHeight: 46,
    margin: '5%',
    marginBottom: 0,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingHorizontal: 16,
    //backgroundColor: 'rgba(118, 118, 118, 0.50)',

    // mixBlendMode: 'multiply',

    elevation: 1, // Android 阴影效果
    shadowColor: 'rgba(0, 0, 0, 0.25)', // iOS 阴影颜色
    shadowOffset: { width: 0, height: 5 }, // iOS 阴影偏移
    shadowOpacity: 0.25, // iOS 阴影不透明度
    //shadowRadius: 5, // iOS 阴影半径
    borderRadius: 22,
    backdropFilter: 'blur(4px)',



  },
  headerTitle: {
    flex: 1,

    margin: 5,
  },
  leftButton: {
    position: "absolute",
    left: 10,
    alignSelf: 'center',
    zIndex: 100,
  },
  bottomButton: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  rightButton: {
    right: 20
  },
  icon: {
    width: 40,
    height: 40
  },
});



