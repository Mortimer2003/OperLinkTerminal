import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { Enroll } from "./Enroll";
import * as React from "react";

const LoginStack = createNativeStackNavigator();

// @ts-ignore
export function LoginScreen({ route,navigation }) {
  return <LoginStack.Navigator initialRouteName={"Login"}>
            <LoginStack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <LoginStack.Screen name="Enroll" component={Enroll} />
          </LoginStack.Navigator>

}
