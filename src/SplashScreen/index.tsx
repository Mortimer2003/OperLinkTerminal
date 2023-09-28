// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import App from '../../App';

const SplashScreen = ({ navigation }) => {
  //const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    // 模拟加载，您可以在此处执行初始化操作
    setTimeout(() => {
      navigation.navigate('Main'); // 导航到主屏幕
    }, 1000); // 设置加载页显示时间，单位为毫秒

  }, [navigation,isFocused]);

  return (
    <View style={styles.container}>
      {/* 添加您的加载页内容，例如标志、动画、加载指示器等 */}
      {/*<ActivityIndicator size="large" color="#007AFF" />*/}
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
