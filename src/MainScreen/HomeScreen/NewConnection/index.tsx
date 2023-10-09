import {
  Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput,
  useColorScheme,
  Dimensions, Modal, FlatList, ImageBackground, Easing, Animated, Keyboard, LayoutAnimation
} from "react-native";
import * as React from "react";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { header } from "../index";
import { HostContext, saveData } from "../../../../App";

// @ts-ignore
export function NewConnectionPage({ route, navigation }) {

  // @ts-ignore
  const { hostSlice, setHostSlice } = useContext(HostContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };


  {/*——————————————————————————————————标头————————————————————————————————————*/}



  const headerTitle = () => <Text style={styles.sectionTitle}>新建连接</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true });
  }, []);

  {/*—————————————————————————————————正文————————————————————————————————————*/}

  const [combine, onChangeCombine] = React.useState("");
  const [username, onChangeUsername] = React.useState("");
  const [host, onChangeHost] = React.useState("");
  const [port, onChangePort] = React.useState("");
  const [nickname, onChangeNickname] = React.useState("");
  const [protocol, setProtocol] = useState("ssh");
  const [encode, setEncode] = useState("utf-8");

  const [menuPosition_Protocol, setMenuPosition_Protocol] = useState({ top: 0 });
  const [menuPosition_Encode, setMenuPosition_Encode] = useState({ top: 0 });

  const [isMenuVisible_Protocol, setIsMenuVisible_Protocol] = useState(false);
  const [isMenuVisible_Setting, setIsMenuVisible_Setting] = useState(false);
  const [isMenuVisible_Encode, setIsMenuVisible_Encode] = useState(false);

  const [openShell, setOpenShell] = useState(false);

  const arrowRef_Protocol = useRef(null);
  const arrowRef_Encode = useRef(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const colors = [
    'red', 'green', 'blue', 'yellow', 'purple',
    'orange', 'pink', 'cyan', 'magenta', 'gray',
  ];

  // const [isFlipped, setIsFlipped] = useState(false);
  // const flipAnim = new Animated.Value(0);
  //
  // const startFlipAnimation = () => {
  //   const toValue = isFlipped ? 0 : 180;
  //
  //   Animated.timing(flipAnim, {
  //     toValue,
  //     duration: 1000, // 动画持续时间
  //     easing: Easing.linear,
  //     useNativeDriver: false, // 必须设置为false才能旋转图像
  //   }).start(() => {
  //     setIsFlipped(!isFlipped);
  //   });
  // };
  //
  // const spin = flipAnim.interpolate({
  //   inputRange: [0, 180],
  //   outputRange: ['0deg', '180deg'],
  // });

  const handleSet_Protocol = () => {
    // startFlipAnimation()

    if (!isMenuVisible_Protocol) {
      // 计算按钮的位置并设置菜单位置
      // @ts-ignore
      arrowRef_Protocol.current.measureInWindow((x, y, width, height) => {
        setMenuPosition_Protocol({ top: y + height });
      });
    }
    else setIsMenuVisible_Protocol(false);
  };

  useEffect(()=>{
    if(menuPosition_Protocol.top!==0)
      setIsMenuVisible_Protocol(true);
  },[menuPosition_Protocol])

  const handleSet_Setting = () => {

    if (!isMenuVisible_Setting) {
      const parts = combine.split(/[@:]/);
      onChangeUsername(parts[0] || "");
      onChangeHost(parts[1] || "");
      onChangePort(parts[2] || "");
    } else if(username||host||port)
      onChangeCombine(username + "@" + host + ":" + port);
    else onChangeCombine("");

    setIsMenuVisible_Setting(!isMenuVisible_Setting);
  };

  const handleColor = () => {

  };

  const handleColorSelect = (color: React.SetStateAction<null>) => {
    setSelectedColor(color);
  };

  // @ts-ignore
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorItem, { backgroundColor: item }]}
      onPress={() => handleColorSelect(item)}
    />
  );

  const handleSet_Encode = () => {
    if (!isMenuVisible_Encode) {
      // 计算按钮的位置并设置菜单位置
      // @ts-ignore
      arrowRef_Encode.current.measureInWindow((x, y, width, height) => {
        setMenuPosition_Encode({ top: y + height });
      });
    }
    else setIsMenuVisible_Encode(false);
  };

  useEffect(()=>{
    if(menuPosition_Encode.top!==0)
      setIsMenuVisible_Encode(true);
  },[menuPosition_Encode])

  const handleSet_Shell = () => {
    setOpenShell(!openShell)
  };

  const handleSave = () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+:\d+$/;
    //let name=''
    let name={
      username:"",
      host:"",
      port:""
    }

    if (!isMenuVisible_Setting){
      if(!combine){alert('请输入“用户名@主机:端口”！');return;}
      if(!regex.test(combine)){alert('请输入正确格式的“用户名@主机:端口”！');return;}
      //name=combine;
      const parts = combine.split(/[@:]/);
      name.username=parts[0];
      name.host=parts[1];
      name.port=parts[2];
    }
    else{
      if(!regex.test(username+"@"+host+":"+port)){alert('请检查输入的用户名、主机与端口！');return;}
      //name=username+"@"+host+":"+port;
      name={ username,host,port }
    }

    const newHost={
      state: false, time: "", protocol, name, nickname, encode, openShell,
      color: 'black',//TODO: 修改为设定的color
    }

    setHostSlice([...hostSlice,newHost])
    saveData('HostSlice',[...hostSlice,newHost])

    navigation.navigate('RemoteConnection')
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

  {/*—————————————————————————————————————————————————————————————————————————*/}

  // @ts-ignore
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
        <ScrollView style={[styles.body,isKeyboardOpen?{marginBottom: 100}:{marginBottom: 120,}, ]}>

          <View>

            {/*—————————————————————————————协议————————————————————————————————*/}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSet_Protocol}
              style={styles.item}
            >
              <Image source={require("../../../../assets/computer.png")} style={styles.icon} />
              <View style={{ display: "flex", flexDirection: "column",marginLeft: 10 }}>
                <Text style={styles.title1}>协议</Text>
                <Text style={styles.title2}>{protocol}</Text>
              </View>
              <View style={styles.arrowContainer} >
                <Image source={isMenuVisible_Protocol?require('../../../../assets/arrow_up.png'):require('../../../../assets/arrow_down.png')} style={styles.arrow} ref={arrowRef_Protocol}/>


                <Modal
                  transparent={true}
                  visible={isMenuVisible_Protocol}
                  onRequestClose={handleSet_Protocol}
                >
                  <TouchableOpacity onPress={handleSet_Protocol} style={styles.overlay}>
                    <View style={[styles.modalContainer, { top: menuPosition_Protocol.top + 2 }]}>
                      <TouchableOpacity onPress={() => {
                        handleSet_Protocol();
                        setProtocol("ssh");
                      }}><Text style={styles.modalText}>ssh</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        handleSet_Protocol();
                        setProtocol("local");
                      }}><Text style={styles.modalText}>local</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        handleSet_Protocol();
                        setProtocol("telnet");
                      }}><Text style={styles.modalText}>telnet</Text></TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </TouchableOpacity>

            {/*—————————————————————————————信息————————————————————————————————*/}
            <View
              style={styles.item}
            >
              <View style={{ display: "flex", flexDirection: "column", width: "100%" }}>

                <View style={{overflow: "hidden"}}>
                  <TouchableOpacity style={styles.inputHeader} activeOpacity={0.5}  >
                      <TextInput
                        style={[styles.input,{marginRight: 10}]}
                        onChangeText={text => {
                          onChangeCombine(text);
                        }}
                        value={isMenuVisible_Setting ? (username || host || port ? username + "@" + host + ":" + port : "") : combine}
                        placeholder={"用户名@主机:端口"}
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        editable={!isMenuVisible_Setting}
                      />

                      <TouchableOpacity activeOpacity={0.5} onPress={handleSet_Setting} style={[styles.arrow,{right:-30, }]}>
                        <Image source={isMenuVisible_Setting?require('../../../../assets/arrow_up.png'):require('../../../../assets/arrow_down.png')} style={[styles.arrow]} />
                      </TouchableOpacity>

                  </TouchableOpacity>

                  {isMenuVisible_Setting && <View style={{ paddingBottom: 10, paddingTop: 0}}>
                    <><TextInput
                        style={[styles.input,{margin: 10}]}
                        onChangeText={text => onChangeUsername(text)}
                        value={username || ""}
                        placeholder={"用户名"}
                        placeholderTextColor="rgba(255,255,255,0.8)"
                     /><TextInput
                        style={[styles.input,{margin: 10}]}
                        onChangeText={text => onChangeHost(text)}
                        value={host || ""}
                        placeholder={"主机"}
                        placeholderTextColor="rgba(255,255,255,0.8)"
                     /><TextInput
                        style={[styles.input,{margin: 10}]}
                        onChangeText={text => onChangePort(text)}
                        value={port || ""}
                        placeholder={"端口"}
                        placeholderTextColor="rgba(255,255,255,0.8)"
                      /></>
                  </View>}
                </View>


              </View>
            </View>

            {/*—————————————————————————————昵称————————————————————————————————*/}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.item}
            >
              <Image source={require("../../../../assets/nickname.png")} style={styles.icon} />
              <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                <TextInput
                  style={styles.input}
                  onChangeText={text => onChangeNickname(text)}
                  value={nickname}
                  placeholder={"昵称"}
                  placeholderTextColor="rgba(255,255,255,0.8)"
                />
              </View>
            </TouchableOpacity>

            {/*—————————————————————————————颜色————————————————————————————————*/}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleColor}
              style={[styles.item]}
            >
                <Image source={require("../../../../assets/colortype.png")} style={styles.icon} />
                <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                  <Text style={styles.title1}>颜色类型</Text>
                </View>

            </TouchableOpacity>

            {/*—————————————————————————————编码————————————————————————————————*/}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSet_Encode}
              style={styles.item}
            >
              <Image source={require("../../../../assets/encode.png")} style={styles.icon} />
              <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                <Text style={styles.title1}>编码</Text>
                <Text style={styles.title2}>{encode}</Text>
              </View>

              <View style={styles.arrowContainer}>
                <Image source={isMenuVisible_Encode?require('../../../../assets/arrow_up.png'):require('../../../../assets/arrow_down.png')} style={[styles.arrow]} ref={arrowRef_Encode}/>

                <Modal
                  transparent={true}
                  visible={isMenuVisible_Encode}
                  onRequestClose={handleSet_Encode}
                >
                  <TouchableOpacity onPress={handleSet_Encode} style={styles.overlay}>
                    <View style={[styles.modalContainer, { top: menuPosition_Encode.top + 2 }]}>
                      <TouchableOpacity onPress={() => {
                        handleSet_Encode();
                        setEncode("utf-8");
                      }}><Text style={styles.modalText}>utf-8</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        handleSet_Encode();
                        setEncode("其它");
                      }}><Text style={styles.modalText}>其它</Text></TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </TouchableOpacity>

            {/*—————————————————————————————会话————————————————————————————————*/}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={()=>{}}
              style={styles.item}
            >
              <Image source={require("../../../../assets/computer.png")} style={styles.icon} />
              <View style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                <Text style={styles.title1}>{openShell?"关闭":"开启"}Shell会话</Text>
                <Text style={styles.title2}>禁用此设置以仅使用端口转发</Text>
              </View>

              <TouchableOpacity activeOpacity={0.9} style={styles.arrowContainer} onPress={handleSet_Shell}>
                <Image style={[styles.switch]} source={openShell?require("../../../../assets/switch_on.png"):require("../../../../assets/switch_off.png")}/>
              </TouchableOpacity>
            </TouchableOpacity>

          </View>

          {/*—————————————————————————————保存————————————————————————————————*/}

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleSave}
              style={[styles.button,{marginVertical: 30}]}
            >
              <Text style={{textAlign: "center",lineHeight: 50,fontSize: 20,}}>保存</Text>
            </TouchableOpacity>

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
    // wordWrap: 'break-word',
  },
  icon: {
    width: 40,
    height: 40
  },
  body: {
    top: 90,
    width: '90%',
    height: "auto",
    marginLeft: '5%',
    marginRight: '5%',
    //marginBottom: 120,
    flex: 1,
    backgroundColor: 'rgba(90, 90, 90, 0.50)',
    borderRadius: 22,
    backdropFilter: 'blur(4px)',
    // Android 阴影样式
    elevation: 1,
    // iOS 阴影样式
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden"
  },
  item: {
    padding: 20,
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.30)",

  },
  button: {
    marginLeft: '20%',
    marginRight: '20%',
    // marginTop: 20,
    width: '60%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 25,
    //borderWidth: 1,

  },
  title1: {
    //fontSize: 20,
    //fontWeight: "bold",
    color: '#F5F5F5',
    fontSize: 21,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // wordWrap: 'break-word'
  },
  title2: {
    color: '#BFBFBF',
    fontSize: 14,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // wordWrap: 'break-word'
  },
  input: {
    height: 30,
    width: 0.7*screenWidth,
    lineHeight: 25,
    padding: 0,
    paddingLeft: 10,
    color: 'rgba(255,255,255,0.8)',
    margin: 5,

    // mixBlendMode: 'soft-light',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  arrowContainer: {
    width: "auto",
    position: "absolute",
    right: 0,
    display: "flex",
    fontSize: 20
  },
  inputHeader: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10
  },
  arrow: {
    height: 12,
    width: 25,
    right: 30,
  },
  switch: {
    height: 40,
    width: 40,
    right: 20,
  },
  modalContainer: {
    alignSelf: "flex-end",
    width: "25%",
    right: "5%",
    padding: 10,
    paddingLeft: 20,
    marginRight: 5,

    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    backdropFilter: 'blur(10px)',
    zIndex: 999,
    // transitionProperty: "top",
    // transitionDuration: 3,
  },
  modalText: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%"
    //backgroundColor: "rgba(0, 0, 0, 0.1)",
  },

  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  header: {
    width: '90%',
    margin: '5%',
    height: 46,

    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(118, 118, 118, 0.50)',

    // mixBlendMode: 'multiply',

    elevation: 1, // Android 阴影效果
    shadowColor: 'rgba(0, 0, 0, 0.25)', // iOS 阴影颜色
    shadowOffset: { width: 0, height: 5 }, // iOS 阴影偏移
    shadowOpacity: 0.25, // iOS 阴影不透明度
    //shadowRadius: 5, // iOS 阴影半径
    borderRadius: 22,
    backdropFilter: 'blur(4px)'
  },

});

