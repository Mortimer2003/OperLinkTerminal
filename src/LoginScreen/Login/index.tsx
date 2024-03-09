import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableOpacityComponent, useColorScheme,
  View, Alert, Keyboard, LayoutAnimation, BackHandler
} from "react-native";
import * as React from "react";
import { useContext, useState, useEffect, useRef } from "react";
// import { HostContext, UserContext } from "../../HomeScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { saveData, UserContext } from "../../../App";
import { UserType } from "../../../module/dataModule/types";
import { login, sendCode } from "../../../module/httpModule/http";

// @ts-ignore
export function Login({ route,navigation }) {

  const { userSlice, setUserSlice } = useContext(UserContext);

  useEffect(() => {

    return navigation.addListener('beforeRemove', (e: { data: { action: { type: string; }; }; preventDefault: () => void; }) => {
      // Prevent default behavior of going back
      if(!userSlice.isLogin&&e.data.action.type==="POP_TO_TOP")return;

      e.preventDefault();
      //返回直接退出应用
      // console.log(e)
      // console.log(222)
      BackHandler.exitApp();
    });
  }, [navigation]);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const [loginType, setLoginType]=useState<'CaptchaCode'|'PassWord'>('CaptchaCode')

  const [phone,onChangePhone] = useState('')
  const [captchaCode,onChangeCaptchaCode] = useState('')
  const [nickname,onChangeNickname] = useState('')
  const [password,onChangePassword] = useState('')

  const [isCounting, setIsCounting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [correctCode,onChangeCorrectCode] = useState<string|null>(null)

  const [isAgree, setIsAgree] = useState(false);

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


  const clear = () => {
    onChangePhone('')
    onChangeCaptchaCode('')
    onChangeNickname('')
    onChangePassword('')
    setIsCounting(false)
    setRemainingTime(60)
    setIsAgree(false)
  }

  const phoneNumberPattern = /^1\d{10}$/
  const sendCaptchaCode = () => {
    if(phoneNumberPattern.test(phone)){
      // 发送验证码
      sendCode(phone).then((res)=>{
        const { code, time } = res as { code: string; time: number };
        onChangeCorrectCode(code);
        setTimeout(()=>{
          onChangeCorrectCode('');
        }, time);
      }).catch()
      setIsCounting(true);
    } else {
      Alert.alert('请输入有效的手机号!');
    }

  }

  let loginInProcess=useRef(false);
  const handleLogin = () => {
    if(loginInProcess.current)return;
    loginInProcess.current=true;
    // TODO: 验证登录
    if(!isAgree){
      alert("需同意用户协议！")
      return;
    } else if(captchaCode!==correctCode/*验证码错误*/){
      alert("验证码错误！")
    }

    switch (loginType) {
      case "PassWord":{
        login(nickname, password, undefined).then((res)=> {
          if(res/*密码正确*/){
            const newUserSlice:UserType = {
              //如何完整获取用户信息？（解析jwt）
              id:'',
              nickname: nickname,
              password: password,
              phone: '',
              avatar: { uri: '' },
              isLogin: true,
              enterprise: null,
              level: 3
            };
            setUserSlice(newUserSlice);
            saveData('UserSlice',newUserSlice)
            navigation.navigate('MainScreen');
            clear()
          }else alert("密码错误！")
          loginInProcess.current=false;
        }).catch();
        break;
      }
      case "CaptchaCode": {
        login(phone, undefined, captchaCode).then((res) => {
          if (res/*验证码正确, correctCode===captchaCode*/) {
            const newUserSlice: UserType = {
              //TODO:解析jwt获取用户信息
              id:'',
              nickname:'user',
              password:'',
              phone:phone,
              avatar: { uri: '' },
              isLogin: true,
              enterprise: null,
              level: 3
            };
            setUserSlice(newUserSlice);
            saveData('UserSlice', newUserSlice)
            navigation.navigate('MainScreen');
            clear()
          } else alert("验证码错误！")
          loginInProcess.current=false;
        }).catch();
        break;
      }
    }

  }

  const toEnroll = () => {
    navigation.navigate('Enroll');
    clear()
  }

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // LayoutAnimation.easeInEaseOut();
        // setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // LayoutAnimation.easeInEaseOut(); // 添加过渡效果
        // setIsKeyboardOpen(false);
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
          source={require('../../../assets/background_login.png')} // 指定背景图片的路径
          style={{ flex: 1/*, resizeMode: 'cover'*/}}
        >
          <View style={styles.body}>

            <Image source={require('../../../assets/logo_transparent.png')}
                   style={{width: 400, height:100, alignSelf: 'center', marginVertical: 20, opacity: 0.2}}/>

            <View>
              <View style={{flexDirection: 'row',justifyContent:'space-evenly'}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setLoginType('CaptchaCode')}
                  style={[styles.button_choose,loginType==='CaptchaCode'?{borderWidth:1,backgroundColor:'rgba(0,0,0,0.1)'}:{}]}
                ><Text style={styles.text1}>验证码登录</Text></TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setLoginType('PassWord')}
                  style={[styles.button_choose,loginType==='PassWord'?{borderWidth:1,backgroundColor:'rgba(0,0,0,0.1)'}:{}]}
                ><Text style={styles.text1}>账号密码登录</Text></TouchableOpacity>
              </View>

              { loginType==="CaptchaCode"?
                  <>
                    <View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>手机号：</Text>
                        <TextInput
                          style={styles.input}
                          value={phone}
                          onChangeText={onChangePhone}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>验证码：</Text>
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
                    </View>
                  </>
                :
                loginType==="PassWord"?
                  <>
                    <View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>用户名：</Text>
                        <TextInput
                          style={styles.input}
                          value={username}
                          onChangeText={onChangeUsername}
                        />
                      </View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>密码：    </Text>
                        <TextInput
                          secureTextEntry={true} //TODO:为什么加密不生效？
                          style={styles.input}
                          value={password}
                          onChangeText={onChangePassword}
                        />
                      </View>
                    </View>
                  </>
                :
                  <></>
              }
              <View style={{alignSelf:'center', margin: 5, flexDirection:'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{setIsAgree(!isAgree)}}>
                  <Image source={isAgree?require('../../../assets/radio_on.png'):require('../../../assets/radio_off.png')} style={{width:18,height:18, margin: 5}}/>
                </TouchableOpacity>
                <Text style={{color: '#BCB7B1', fontSize: 17, fontFamily: 'Source Han Sans CN', fontWeight: '400', }}>我已阅读并同意《xxx用户协议》</Text></View>
            </View>

            <View style={[{bottom: 50},/*isKeyboardOpen?{display: 'none'}:{}*/]}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleLogin}
                style={[{ alignSelf:'center',opacity: 0.80, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 22, width: '60%',  alignItems: 'center', padding: 10,margin:10}]}
              ><Text style={{color: '#EBE7DB', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>登录</Text></TouchableOpacity>
              <TouchableOpacity style={{alignSelf:'center'}} onPress={toEnroll}><Text style={{color: '#BCB7B1', fontSize: 19, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}>没有账号？点击注册</Text></TouchableOpacity>
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
    justifyContent: 'space-between'
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
    paddingHorizontal: 15,
    paddingVertical: 5,
    height: 35,
    lineHeight: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
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
});

