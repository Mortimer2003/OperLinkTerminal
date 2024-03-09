import * as React from "react";
import { AIChatPage } from "./AIChat";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RemoteConnectionPage } from "../HomeScreen/RemoteConnection";

const AIStack = createNativeStackNavigator();

export const AIScreen = ({ route,navigation }) => {

   return <AIStack.Navigator initialRouteName={"AIChat"}>
            <AIStack.Screen name="AIChat" component={AIChatPage} />
          </AIStack.Navigator>
};
