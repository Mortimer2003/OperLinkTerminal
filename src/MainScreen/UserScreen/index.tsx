import { useEffect,} from "react";
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyHomePage } from "./MyHome";
import { EnterpriseRegisterPage } from "./EnterpriseRegister";
import { ColleagueHostPage } from "./ColleagueHost";

const UserStack = createNativeStackNavigator();
// @ts-ignore
export const UserScreen = ({ route, navigation }) => {

  return <UserStack.Navigator initialRouteName={"RemoteConnection"}>
    <UserStack.Screen name="MyHome" component={MyHomePage} />
    <UserStack.Screen name="ColleagueHost" component={ColleagueHostPage} />
    <UserStack.Screen name="EnterpriseRegister" component={EnterpriseRegisterPage} />
  </UserStack.Navigator>
};

