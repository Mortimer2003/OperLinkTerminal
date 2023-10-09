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
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { AssistancePage } from "./Assistance";
import { saveData, UserContext } from "../../../App";



const HomeStack = createNativeStackNavigator();

// @ts-ignore
export function HomeScreen({ route,navigation }) {
  const { userSlice, setUserSlice } = useContext(UserContext);

  useEffect(() => {

    return navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of going back
      e.preventDefault();
      //TODO:返回直接退出应用
    });
  }, [navigation]);


  return <HomeStack.Navigator initialRouteName={"RemoteConnection"}>
            <HomeStack.Screen name="RemoteConnection" component={RemoteConnectionPage} />
            <HomeStack.Screen name="NewConnection" component={NewConnectionPage} />
            <HomeStack.Screen name="RemoteOperation" component={RemoteOperationPage} />
            <HomeStack.Screen name="ManageKeys" component={ManageKeysPage} />
            <HomeStack.Screen name="GenerateKey" component={GenerateKeyPage} />
            <HomeStack.Screen name="Settings" component={SettingsPage} />
            <HomeStack.Screen name="Assistance" component={AssistancePage} />
          </HomeStack.Navigator>
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
            <Image style={styles.icon} source={require("../../../assets/back.png")} />
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
    // fontSize: 17,
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



