/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import * as React from "react";
import { AppRegistry, TouchableOpacity } from "react-native";
import { NavigationContainer, Route } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { createStackNavigator } from '@react-navigation/stack';
import axios from "axios";
import type { PropsWithChildren } from "react";
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from "react-native";
import {
  Colors
} from "react-native/Libraries/NewAppScreen";
import { HomeScreen } from "./src/HomeScreen";
import { name as appName } from "./app.json";
import SplashScreen from "./src/SplashScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
// import { SvgXml } from "react-native-svg";


const TestScreen = () => {
  return (
    <View>
      <Text>TEST</Text>
    </View>
  );
};

//const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Main = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Main.Navigator initialRouteName="Splash">
        <Main.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // 隐藏导航栏
        />
        <Main.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        {/* 添加其他屏幕 */}
      </Main.Navigator>
    </NavigationContainer>
  );
}

const tabBarIcons = {
  "远程连接": require("./assets/connect.png"),
  "智能交互": require("./assets/ai.png"),
  "我的": require("./assets/user.png")
};
const tabBarIcons_light = {
  "远程连接": require("./assets/connect_light.png"),
  "智能交互": require("./assets/ai_light.png"),
  "我的": require("./assets/user_light.png")
};

// @ts-ignore
function CustomTabBar({ state, descriptors, navigation }) {
  // if (!tabBarVisible) {
  //   return null;
  // }

  // console.log(state.routes[0].params)
  // 获取当前活动页面的路由描述符
  const route = state.routes[state.index];
  const descriptor = descriptors[route.key];
  const { options } = descriptor;

  // 从当前页面的选项中获取 tabBarVisible 属性，默认为 true
  const tabBarVisible = options.tabBarVisible !== false;

  //console.log({ tabBarVisible })

  return (
    <View style={[styles.tabBarContainer, { display: tabBarVisible ? "flex" : "none" }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabBarButton, { backgroundColor: "#5E5B58" }]}
          >
            <Image style={styles.icon} source={isFocused ? tabBarIcons_light[route.name] : tabBarIcons[route.name]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


function getStackNavigationName(route: Partial<Route<string, object | undefined>>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'RemoteConnection';

  switch (routeName) {
    case 'RemoteConnection':
      return true;
    default: return false;
  }
}

function MainScreen(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  // const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  //
  // useEffect(()=>{
  //   console.log({isTabBarVisible})
  // },[isTabBarVisible])

  // @ts-ignore
  return (
     // <NavigationContainer>
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}
                     screenOptions={{ headerShown: false,}}>
        <Tab.Screen name="远程连接" component={HomeScreen} options={
            ({ route }) => ({
              tabBarVisible: getStackNavigationName(route),
              tabBarLabelStyle: styles.tabBarLabel,
            })
        } /*initialParams={{
          isTabBarVisible,
          setIsTabBarVisible
        }}*//>
        <Tab.Screen name="智能交互" component={TestScreen} options={{ tabBarLabelStyle: styles.tabBarLabel }}/>
        <Tab.Screen name="我的" component={TestScreen} options={{ tabBarLabelStyle: styles.tabBarLabel }}/>
      </Tab.Navigator>
    // </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  tabBarLabel: {
    //fontSize: 16, // 设置文本大小
  },
  tabBarContainer: {
    bottom: 10,
    width: "90%",
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#5E5B58',
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
    margin: 20,
    borderRadius: 22,
    padding: 20,
    shadowColor: 'rgba(139, 134, 129, 0.64)', // 阴影颜色
    shadowOffset: {
      width: 0,
      height: 0,
    }, // 阴影偏移量
    shadowOpacity: 1, // 阴影不透明度
    shadowRadius: 20, // 阴影模糊半径
    elevation: 5,
    backdropFilter: 'blur(2px)'
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  icon: {
    width: 20,
    height: 20,
    //padding: 10,
  },
});


export default App;
