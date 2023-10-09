import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableOpacityComponent, useColorScheme,
  View, Alert, Keyboard, LayoutAnimation
} from "react-native";
import * as React from "react";
import {launchImageLibrary} from 'react-native-image-picker';
import { useContext, useState, useEffect, useLayoutEffect } from "react";
// import { HostContext, UserContext } from "../../HomeScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { saveData, UserContext } from "../../../App";
import { UserType } from "../../../module/types";

// @ts-ignore
export function Enroll({ route,navigation }) {

  const { userSlice, setUserSlice } = useContext(UserContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const handleSkip = () => {
    //TODO: 跳过注册
    navigation.navigate('MainScreen');
  }

  // @ts-ignore
  const header = ({ navigation, route, options, back }) => (
    <View style={[styles.header]}>
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        <View style={styles.leftButton}>
          <TouchableOpacity onPress={() => {
          navigation.goBack();
        }} >
          <Image style={styles.icon} source={require("../../../assets/back.png")} />
        </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle,{textAlign: 'center'}]}>注册</Text>
        <View style={styles.rightButton}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleSkip}>
            <Text style={{color: 'rgba(196.76, 183.03, 166.92, 0.82)', fontSize: 14, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}>
              跳过
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ header, headerTransparent:true,  });
  }, []);

  const [phone,onChangePhone] = useState('')
  const [captchaCode,onChangeCaptchaCode] = useState('')
  const [username,onChangeUsername] = useState('')
  const [password,onChangePassword] = useState('')
  const [passwordConfirm,onChangePasswordConfirm] = useState('')

  const [isCounting, setIsCounting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);

  const [isAgree, setIsAgree] = useState(false);

  const [avatarSource, setAvatarSource] = useState(null);

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
    };

    // 打开相册
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('用户取消了选择图片');
      } else if (response.errorMessage) {
        console.log('选择图片时出现错误:', response.errorMessage);
      } else {
        console.log(response.assets)
        // 选择图片成功，设置头像源
        // @ts-ignore
        setAvatarSource({ uri: response.assets[0].uri });
        //console.log(source)
        //参考 https://www.npmjs.com/package/react-native-image-picker?activeTab=readme
      }
    });
  };

  // useEffect(()=>{
  //   console.log(avatarSource)
  // },[avatarSource])

  // 当 isCounting 改变时，启动或停止计时器
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    if (isCounting) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    // 当 remainingTime 到达 0 时，重置按钮状态
    if (remainingTime === 0) {
      setIsCounting(false);
      setRemainingTime(60);
    }

    // 在组件卸载时清除计时器
    return () => clearInterval(timer);
  }, [isCounting, remainingTime]);


  const phoneNumberPattern = /^1\d{10}$/
  const sendCaptchaCode = () => {
    if(phoneNumberPattern.test(phone)){
      // TODO: 发送验证码

      setIsCounting(true);
    } else {
      Alert.alert('请输入有效的手机号!');
    }

  }

  const handleEnroll = () => {
    // TODO: 验证注册
    if(!isAgree){
      alert("需同意用户协议！")
      return;
    }
    if(!username){
      alert("请输入用户名！")
    } else if(0/*验证码错误*/){
      alert("验证码错误！")
    } else if(!password){
      alert("请输入密码！")
    } else if(passwordConfirm!==password){
      alert("两次输入的密码不一致！")
    } else {
      const newUserSlice:UserType = {
        username,
        password,
        phone,
        avatar: "",
        isLogin: true
      };
      setUserSlice(newUserSlice);
      saveData('UserSlice',newUserSlice)
      navigation.navigate('MainScreen');
    }
  }


  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.easeInEaseOut();
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.easeInEaseOut(); // 添加过渡效果
        setIsKeyboardOpen(false);
      }
    );

    // 返回一个清理函数以在组件卸载时取消监听
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <ImageBackground
          source={require('../../../assets/background_login.png')}
          style={{ flex: 1, }}
          resizeMode='cover'
        >

          <View style={styles.body}>

            <View>
              <TouchableOpacity onPress={handleChooseImage} style={{borderRadius: 100, borderWidth: 1, width: 128, height: 128, borderColor: 'white', alignSelf: 'center', margin: 50, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                {
                  avatarSource ?
                    <Image source={avatarSource} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                    :
                    <Text style={{color: 'white'}}>选择头像</Text>
                }
              </TouchableOpacity>
              <View style={styles.input_container}>
                <Text style={styles.text2}>用户名：    </Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={onChangeUsername}
                />
              </View>
              <View style={styles.input_container}>
                <Text style={styles.text2}>手机号：    </Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={onChangePhone}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.input_container}>
                <Text style={styles.text2}>验证码：    </Text>
                <TextInput
                  style={styles.input}
                  value={captchaCode}
                  onChangeText={onChangeCaptchaCode}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={sendCaptchaCode}
                  disabled={isCounting}
                  style={{width: 80, borderRadius: 20, borderWidth:1, borderColor: '#A5A5A5', height: 35, padding: 5, justifyContent: 'center', alignItems: 'center'}}
                ><Text style={{color: '#D2C7C7', fontSize: 12, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}> {isCounting ? ` ${remainingTime} 秒` : '发送验证码'}</Text></TouchableOpacity>
              </View>
              <View style={styles.input_container}>
                <Text style={styles.text2}>密码：        </Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  value={password}
                  onChangeText={onChangePassword}
                />
              </View>
              <View style={styles.input_container}>
                <Text style={styles.text2}>确认密码：</Text>
                <TextInput
                  secureTextEntry={true}
                  style={styles.input}
                  value={passwordConfirm}
                  onChangeText={onChangePasswordConfirm}
                />
              </View>
              <View style={{alignSelf:'center', margin: 5, flexDirection:'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{setIsAgree(!isAgree)}}>
                  <Image source={isAgree?require('../../../assets/radio_on.png'):require('../../../assets/radio_off.png')} style={{width:18,height:18, margin: 5}}/>
                </TouchableOpacity>
                <Text style={{color: '#BCB7B1', fontSize: 17, fontFamily: 'Source Han Sans CN', fontWeight: '400', }}>我已阅读并同意《xxx用户协议》</Text></View>
            </View>

            {/*TODO: 弹出键盘时隐藏*/}
            <View style={[{bottom: 50,},isKeyboardOpen?{display: 'none'}:{}]}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleEnroll}
                style={[{ alignSelf:'center',opacity: 0.80, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 22, width: '60%',  alignItems: 'center', padding: 10,margin:10}]}
              ><Text style={{color: '#EBE7DB', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>注册</Text></TouchableOpacity>
              <TouchableOpacity style={{alignSelf:'center'}} ><Text style={{color: '#BCB7B1', fontSize: 19, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}></Text></TouchableOpacity>
            </View>
          </View>

        </ImageBackground>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 50,
  },
  text1: {
    color: '#D6CFBF',
    fontSize: 21,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '700',
  },
  text2: {
    color: '#EBE3CD',
    fontSize: 17,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  button_choose:{
    padding: 10,
    borderRadius: 16,
    borderColor: '#D6CFBF',
    marginVertical: 20,
  },

  input: {
    // width: '60%',
    width: 0,
    flexGrow: 1,
    height: 35,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingLeft: 15,
    alignItems: 'center',
    overflow: 'hidden',
    textAlignVertical: 'top'
  },
  input_container: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 50,
    marginVertical: 10
  },

  header: {
    width: '90%',
    height: 'auto',
    minHeight: 46,
    margin: '5%',
    marginBottom: 0,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },
  headerTitle: {
    flex: 1,
    margin: 5,
    // fontSize: 17,
    color: '#FFF8E7',
    fontSize: 25,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '500',
  },
  leftButton: {
    position: "absolute",
    left: 10,
    alignSelf: 'center',
    zIndex: 100,
  },
  rightButton: {
    position: "absolute",
    paddingVertical: 5,
    paddingHorizontal: 15,
    right: 20,
    backgroundColor: 'rgba(121.32, 116.52, 113.03, 0.50)',
    borderRadius: 22,
    backdropFilter: 'blur(4px)'
  },
  icon: {
    width: 40,
    height: 40
  },
});

