// SplashScreen.js
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, BackHandler } from "react-native";
import { getFocusedRouteNameFromRoute, useIsFocused, useNavigation } from "@react-navigation/native";
import App, { loadData, UserContext } from "../../App";

const SplashScreen = ({ route, navigation }) => {
  //const navigation = useNavigation();
  const { userSlice, setUserSlice } = useContext(UserContext);
  const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    // 在组件挂载时从 AsyncStorage 获取数据
    loadData('UserSlice',setUserSlice,()=>{setLoadingCompleted(true)})
  }, []);

  useEffect(() => {
    //console.log({ loadingCompleted },userSlice.isLogin)
    if(loadingCompleted && isFocused){
      setTimeout(() => {
        navigation.navigate(userSlice.isLogin?'MainScreen':'LoginScreen');
      }, 1000); //TODO:从主页进入登录时最好能跳过加载时间
    }
    // console.log(navigation.getState())

  }, [loadingCompleted,navigation,isFocused,userSlice.isLogin]);


  return (
    <View style={styles.container}>
      <Image style={{width: 393, height: 92}} source={require("../../assets/logo.png")} />
      <Text style={{color: '#787878', fontSize: 15, fontFamily: 'Montserrat Alternates', fontWeight: '700', /*wordWrap: 'break-word'*/}}>operation link</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
