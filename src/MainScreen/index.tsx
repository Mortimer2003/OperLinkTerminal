import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { HomeScreen } from "./HomeScreen";
import * as React from "react";
import { getFocusedRouteNameFromRoute, Route } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserScreen } from "./UserScreen";
import { AIScreen } from "./AIScreen";

const Tab = createBottomTabNavigator();

export function MainScreen(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  function getStackNavigationName(route: Partial<Route<string, object | undefined>>) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'RemoteConnection';

    switch (routeName) {
      case 'RemoteConnection':
        return true;
      default: return false;
    }
  }

  // @ts-ignore
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
      <Tab.Screen name="智能交互" component={AIScreen} options={{ tabBarLabelStyle: styles.tabBarLabel }}/>
      <Tab.Screen name="我的" component={UserScreen} options={{ tabBarLabelStyle: styles.tabBarLabel }}/>
    </Tab.Navigator>
    // </NavigationContainer>

  );
}

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

const prePath='../../assets/'

const tabBarIcons = {
  "远程连接": require(prePath+"connect.png"),
  "智能交互": require(prePath+"ai.png"),
  "我的": require(prePath+"user.png")
};
const tabBarIcons_light = {
  "远程连接": require(prePath+"connect_light.png"),
  "智能交互": require(prePath+"ai_light.png"),
  "我的": require(prePath+"user_light.png")
};

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
