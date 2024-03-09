import {
  Dimensions, Image, ImageBackground, Keyboard, KeyboardAvoidingView, LayoutAnimation, Modal, Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity, useColorScheme, View
} from "react-native";
import * as React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { header } from "../../../Components/Header";
import { KeyContext, saveData } from "../../../../App";
import forge from "node-forge";


async function generateKey(type: string = "RSA", digit: number = 2048) {
  const key = { privateKey: "", publicKey: "" };

  switch (type) {
    case "RSA": {
      try {
        // const keyPair = forge.pki.rsa.generateKeyPair({ bits: digit });
        //
        // key.privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
        // key.publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
        key.privateKey=""
        key.publicKey=""
      } catch (error) {
        console.error("Error generating keys:", error);
      }
      break;
    }
    case "DSA": {
      //TODO:补充DSA密钥生成方法；
      try {

      } catch (error) {
        console.error("Error generating keys:", error);
      }
      break;
    }
    case "EC": {
      try {
        // Generate a new private key
        // const privateKeyBytes = await RandomBytes.randomBytes(32); // 32 bytes for ECDSA
        // const privateKeyBuffer = Buffer.from(privateKeyBytes);
        //
        // // Derive the corresponding public key
        // const publicKeyBuffer = Crypto.createPublicKey(privateKeyBuffer);
        //
        // key.publicKey=publicKeyBuffer.toString('hex');
        // key.privateKey=privateKeyBuffer.toString('hex');
      } catch (error) {
        console.error("Error generating keys:", error);
      }

      break;
    }
    case "Ed25519": {
      try {
        // const privateKeyBytes = await RandomBytes.randomBytes(32); // 32 bytes for Ed25519
        // const privateKeyBuffer = Buffer.from(privateKeyBytes);
        //
        // // Derive the corresponding public key
        // const publicKeyBuffer = Crypto.createPublicKey(privateKeyBuffer);
        //
        // key.publicKey=publicKeyBuffer.toString('hex');
        // key.privateKey=privateKeyBuffer.toString('hex');
      } catch (error) {
        console.error("Error generating keys:", error);
      }

      break;
    }
    default:
      break;
  }

  return key;
}


// @ts-ignore
export function GenerateKeyPage({ navigation }) {
  // @ts-ignore
  const { keySlice, setKeySlice } = useContext(KeyContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>生成</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true  });
  }, []);

  const types = ["RSA", "DSA", "EC", "Ed25519"];

  const [nickname, onChangeNickname] = useState("");
  const [type, onChangeType] = useState(types[0]);
  const [digit, onChangeDigit] = useState("2048");
  const [password, onChangePassword] = useState("");
  const [passwordConfirm, onChangePasswordConfirm] = useState("");

  const [isMenuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    if (type === "EC" || type === "Ed25519") {
      onChangeDigit("256");
    } else {
      onChangeDigit("2048");
    }
  }, [type]);

  const handleSave = () => {
    //TODO:如何生成密钥？
    if (!nickname) {
      alert("请输入昵称！");
      return;
    }
    if (keySlice.some((item: { nickname: string; }) => item.nickname === nickname)) {
      alert("该昵称已被使用！");
      return;
    }
    if (!Number(digit)) {
      alert("请输入正确的位数！");
      return;
    }
    if (password !== passwordConfirm) {
      alert("两次输入的密码不一致！");
      return;
    }

    const newKey = {
      nickname,
      type,
      digit: Number(digit),
      password,
      locked: true,
      keyPair: {
        publicKey: "",
        privateKey: ""
      }
    };
    generateKey(type, Number(digit)).then((value) => {
      newKey.keyPair = value;
      setKeySlice([...keySlice, newKey]);
      saveData('KeySlice',[...keySlice, newKey])
    });
    //TODO:可以添加一个加载等待？
    navigation.navigate("ManageKeys");
  };

  const generateKeyInputItems=[
    {
      title: "昵称",
      value: nickname,
      onChangeValue: onChangeNickname,
      type: 'default',
      tip: null,
      editable: true,
    },{
      title: "类型",
      value: type,
      onChangeValue: onChangeType,
      type: 'select',
      tip: null,
      editable: false,
    },{
      title: "位数",
      value: digit,
      onChangeValue: onChangeDigit,
      type: 'default',
      tip: null,
      editable: type==='RSA'||type==='DSA',
    },{
      title: "密码",
      value: password,
      onChangeValue: onChangePassword,
      type: 'password',
      tip: null,
      editable: true,
    },{
      title: "确认密码",
      value: passwordConfirm,
      onChangeValue: onChangePasswordConfirm,
      type: 'password',
      tip: <Image style={[styles.judge,{opacity: passwordConfirm ? 1:0}]} source={password===passwordConfirm ? require("../../../../assets/correct.png") : require("../../../../assets/error.png")} />,
      editable: true,
    },
  ]

  //const ScreenHeight=Dimensions.get("window").height
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
      <View /*contentInsetAdjustmentBehavior="automatic"*/ style={backgroundStyle}>
        <ImageBackground
          source={require('../../../../assets/background.png')} // 指定背景图片的路径
          style={{ flex: 1, resizeMode: 'cover'}}
        >
        <ScrollView style={[styles.body,isKeyboardOpen?{marginBottom: 100}:{marginBottom: 180,}]} showsVerticalScrollIndicator={false}>
          <View>
          {/*<View style={styles.container}>*/}
            {generateKeyInputItems.map((item,index)=>{

              return <View style={{ marginBottom: 20,}} key={index}>
                  <Text style={styles.title}>{item.title}：</Text>

                  {item.type==='select'?
                    <TouchableOpacity onPress={toggleMenu}
                                      style={[styles.input,{paddingLeft: 0}]}>
                          <View style={styles.selectHeader}>
                            <TextInput
                              style={{padding: 0,color: '#EBE7DB', fontSize: 16, fontFamily: 'Microsoft Tai Le', fontWeight: '700'}}
                              value={item.value}
                              placeholderTextColor="rgba(255,255,255,0.8)"
                              editable={item.editable}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={toggleMenu} style={[styles.arrow,{right:-10}]}>
                              <Image source={isMenuVisible?require('../../../../assets/arrow_up.png'):require('../../../../assets/arrow_down.png')} style={[styles.arrow]} />
                            </TouchableOpacity>
                          </View>
                          {isMenuVisible && types.map((it,i) =>
                              <TouchableOpacity onPress={() => {
                                item.onChangeValue(it);
                                toggleMenu();
                              }} style={[styles.chooseItem,{backgroundColor: item.value===it? 'rgba(255, 200, 138, 0.30)':''}]} key={i}>
                                <Text style={styles.chooseText}>{it}</Text>
                              </TouchableOpacity>
                            )
                          }
                      </TouchableOpacity>
                    :
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TextInput
                        secureTextEntry={item.type==='password'}
                        style={styles.input}
                        onChangeText={(text)=>item.onChangeValue(text)}
                        value={item.value}
                        editable={item.editable}
                      />
                      {item.tip}
                    </View>
                  }
              </View>
            })}
          </View>

          {/*<View style={[{justifyContent:'flex-end'},isKeyboardOpen?{display: 'none'}:{}]}>*/}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSave}
              style={[styles.button,{marginVertical: 30}]}
            >
              <Text style={{ textAlign: "center", lineHeight: 50, color: '#FFC88B', fontSize: 24, fontFamily: 'Microsoft Tai Le', fontWeight: '700', }}>
                生成
              </Text>
            </TouchableOpacity>

          <View style={{height: 100}}></View>
          {/*</View>*/}
        </ScrollView>

        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}


const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#EEEEEF',
    fontSize: 25,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '500',

  },
  button: {
    marginLeft: "20%",
    marginRight: "20%",
    // marginTop: 10,
    marginBottom: 10,
    width: "60%",
    height: 50,

    backgroundColor: 'rgba(180,180,180,0.6)',
    borderRadius: 26,
    backdropFilter: 'blur(10px)'
  },
  body: {
    top: 90,
    width: '90%',
    height: "auto",
    marginLeft: '5%',
    marginRight: '5%',
    //marginBottom: 180,
    padding: 30,
    flex: 1,
    backgroundColor: 'rgba(90, 90, 90, 0.50)',
    borderRadius: 22,
    backdropFilter: 'blur(4px)',
    // Android 阴影样式
    elevation: 1, // 适用于 Android
    // iOS 阴影样式
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
    // justifyContent: 'space-between',
  },
  name: {
    lineHeight: 60,
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  input: {
    height: "auto",
    minHeight: 30,
    width: 0.7*screenWidth,
    lineHeight: 25,
    padding: 0,
    paddingLeft: 15,
    color: 'rgba(255,255,255,0.8)',
    margin: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    flexDirection: "column",
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectHeader: {
    height: 30,
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  arrow: {
    height: 12,
    width: 25,
    right: 30,
  },
  // accordionContent: {
  //
  //   backgroundColor: 'rgba(255,255,255,0.3)',
  //   position: "absolute",
  //   top: 55,
  //   zIndex: 100
  // },
  chooseItem: {
    height: 30,
    Width: "100%",
    width: 500,
    borderColor: "rgba(255, 255, 255, 0.30)",
    borderTopWidth: 1,
    zIndex: 100,
  },
  chooseText: {
    lineHeight: 30,
    marginLeft: 15,
    color: '#C9BFA6',
    fontSize: 16,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '700',
  },
  judge:{
    width: 20,
    height: 20,
    position:'absolute',
    right:0,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 18,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    left: 5,
  }
});

