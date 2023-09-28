import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, TouchableOpacityComponent, useColorScheme,
  View
} from "react-native";
import * as React from "react";
import { useContext, useState } from "react";
import { HostContext, UserContext } from "../../HomeScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";

// @ts-ignore
export function Login({ route,navigation }) {

  const { userSlice, setUserSlice } = useContext(UserContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const [loginType, setLoginType]=useState<'CaptchaCode'|'PassWord'>('CaptchaCode')

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <ImageBackground
          source={require('../../../assets/background_login.png')} // 指定背景图片的路径
          style={{ flex: 1, resizeMode: 'cover'}}
        >
          <View style={styles.body}>

            <Image source={require('../../../assets/logo_transparent.png')}
                   style={{width: 400, height:100, alignSelf: 'center', marginVertical: 20, opacity: 0.6}}/>

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
                        />
                      </View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>验证码：</Text>
                        <TextInput
                          style={styles.input}
                        />
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => {}}
                          style={{borderRadius: 20, borderWidth:1, borderColor: '#A5A5A5', height: 35, padding: 5, justifyContent: 'center'}}
                        ><Text style={{color: '#D2C7C7', fontSize: 12, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}>发送验证码</Text></TouchableOpacity>
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
                        />
                      </View>
                      <View style={styles.input_container}>
                        <Text style={styles.text2}>密码：    </Text>
                        <TextInput
                          style={styles.input}
                        />
                      </View>
                    </View>
                  </>
                :
                  <></>
              }
              <View style={{alignSelf:'center', margin: 5}}><Text style={{color: '#BCB7B1', fontSize: 17, fontFamily: 'Source Han Sans CN', fontWeight: '400', }}>我已阅读并同意《xxx用户协议》</Text></View>
            </View>

            <View style={{bottom: 50}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {}}
                style={[{ alignSelf:'center',opacity: 0.80, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 22, width: '60%',  alignItems: 'center', padding: 10,margin:10}]}
              ><Text style={{color: '#EBE7DB', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>登录</Text></TouchableOpacity>
              <View style={{alignSelf:'center'}}><Text style={{color: '#BCB7B1', fontSize: 19, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}>没有账号？点击注册</Text></View>
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
    flexGrow: 1,
    height: 35,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,

  },
  input_container: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 50,
    marginVertical: 10
  },
  // icon_large: {
  //   width: 100,
  //   height: 100,
  // },
  // icon: {
  //   width: 50,
  //   height: 50,
  //   padding: 10,
  // },
  // icon_small: {
  //   width: 25,
  //   height: 25,
  //   margin: 10,
  // },
  // text1: {
  //   color: '#484B4B',
  //   fontSize: 21,
  //   fontFamily: 'Microsoft Tai Le',
  //   fontWeight: '400',
  //   // wordWrap: 'break-word',
  // },
  // text2: {
  //   color: '#2EB3E0',
  //   fontSize: 14,
  //   fontFamily: 'Microsoft Tai Le',
  //   fontWeight: '400',
  //   // wordWrap: 'break-word'
  // },
  // hostItem: {
  //   flexDirection: "row",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //
  //   // borderColor: "black",
  //   //borderWidth: 1,
  //   //
  //   marginTop: 15,
  //   marginBottom: 10,
  //   padding: 20,
  //
  //   width: "84%",
  //   marginLeft: "8%",
  //   marginRight: "8%",
  //   height: 94,
  //   backgroundColor: '#F5F5F5',
  //   shadowColor: 'rgba(255, 255, 255, 0.50)',
  //   shadowOffset: {
  //     width: -6,
  //     height: -6,
  //   },
  //   shadowOpacity: 1,
  //   shadowRadius: 10,
  //   elevation: 5,
  //   borderRadius: 27,
  // },
  // add: {
  //   position: "absolute",
  //   right: 10,
  //   bottom: 100,
  //   //margin: -20,
  //   borderRadius: 50,
  // },
  //
  // sectionTitle: {
  //   // fontSize: 24,
  //   // fontWeight: "600",
  //   // mixBlendMode: 'multiply',
  //   color: '#BFBFBF',
  //   fontSize: 38,
  //   fontFamily: 'Source Han Sans CN',
  //   fontWeight: '700',
  //   // wordWrap: 'break-word',
  //   marginLeft: 20,
  //   letterSpacing: 20,
  //
  // },
  // setContainer: {
  //   width: "auto"
  // },
  // modalContainer: {
  //   position: 'absolute',
  //   alignSelf: "flex-end",
  //   width: "auto",
  //   height: 'auto',
  //   top: 50,
  //   margin: 10,
  //   padding: 10,
  //   paddingLeft: 25,
  //   paddingRight: 25,
  //   borderRadius: 26,
  //   backgroundColor: "rgba(75.64, 75.64, 75.64, 0.50)",
  //   backdropFilter: 'blur(10px)',
  // },
  // modalText: {
  //   fontSize: 16,
  //   marginTop: 5,
  //   marginBottom: 5,
  //   color: "#F5F5F5",
  //   fontFamily: 'Source Han Sans CN',
  //   fontWeight: '400',
  //   // wordWrap: 'break-word',
  // },
  // overlay: {
  //   flex: 1,
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: "rgba(0, 0, 0, 0)",
  // },
  //
  // modalTitle: {
  //   textAlign:'center',
  //   fontSize: 16,
  //   marginBottom: 10,
  // },
  // overlay_popModal: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   zIndex: 200,
  // },
  // popModal: {
  //   width: '80%',
  //   paddingTop: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //
  //   backgroundColor: '#ECECEC',
  //   // boxShadow: '0px 0px 30px #DADADA',
  //   borderRadius: 34,
  //   elevation: 1,
  // },
  // inputContainer: {
  //   height: 50,
  //   lineHeight: 25,
  //   //flex:1,
  //   // borderWidth: 1,
  //
  //   paddingLeft: 15,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   width: '85%',
  //   backgroundColor: '#F7F6F6',
  //   borderRadius: 28,
  //   overflow: 'hidden',
  // },
  // input_new: {
  //   flexGrow: 1,
  //   overflow: 'hidden',
  //   //backgroundColor: 'pink',
  // },
  // buttonsContainer: {
  //   width: "100%",
  //   justifyContent: 'space-between',
  //   flexDirection: 'row',
  //   borderTopWidth: 0.5,
  //   borderColor: 'rgba(0,0,0,0.3)'
  // },
  // menuButton: {
  //   flex: 1,
  //   //marginTop: 10,
  //   padding: 20,
  //   borderRadius: 5,
  //   alignItems: "center",
  //   borderColor: 'rgba(0,0,0,0.3)'
  // },

});

