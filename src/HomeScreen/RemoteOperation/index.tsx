import {
  Button,
  Dimensions,
  Image, ImageBackground, Keyboard, Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import * as React from "react";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import FloatingButton from "../Components/FloatingButton";
import { header } from "../index";
import SuperModal from "../Components/SuperModal";
import Clipboard from '@react-native-clipboard/clipboard';
// import Voice from '@react-native-community/voice';


// @ts-ignore
export function RemoteOperationPage({ route, navigation }) {
  const { item } = route.params;

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  //处理设置点击
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleStickup = () => {
    //粘贴目前手机粘贴板中的内容
    Clipboard.getString().then((value)=>{
      const content = value;
      console.log({ content })
    });
    //TODO: 粘贴到哪?

    setIsMenuVisible(!isMenuVisible);
  };

  const handleDisconnect = () => {
    //断开与此服务器的连接，断开连接后，返回主界面
    setIsMenuVisible(!isMenuVisible);
    //TODO: 断开连接

    navigation.goBack();
  };

  const handleSpecifySize = () => {
    //指定终端窗口的大小
    setIsMenuVisible(!isMenuVisible);
    setIsSizeModalVisible(true)
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>{item.name.username + "@" + item.name.host}</Text>;
  const headerRight = () => (
    <View style={styles.setContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={toggleMenu}>
        <Image
          style={styles.icon}
          source={require("../../../assets/menu.png")}
        />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity onPress={toggleMenu} style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleStickup}><Text style={styles.modalText}>{'粘贴'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleDisconnect}><Text
              style={styles.modalText}>{'断开连接'}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleSpecifySize}><Text
              style={styles.modalText}>{'指定终端\n界面大小'}</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );


  useLayoutEffect(() => {
    navigation.setOptions({ header, headerTitle, headerRight, headerTransparent:true, bottom:false, headerStyle: {backgroundColor: 'rgba(0, 0, 0, 0.40)'} });
  }, [isMenuVisible]);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isVoiceBoardOpen, setIsVoiceBoardOpen] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);

  const [isSizeModalVisible,setIsSizeModalVisible] = useState(false)

  // 初始化Voice
  // Voice.onSpeechStart = () => {
  //   console.log('语音识别已启动');
  // };
  //
  // Voice.onSpeechEnd = () => {
  //   console.log('语音识别已结束');
  // };
  //
  // Voice.onSpeechResults = (e) => {
  //   console.log('语音识别结果：', e.value);
  // };
  const textInputRef = useRef(null);

  const handleKeyboardButtonPress = () => {
    if (!isKeyboardVisible && textInputRef.current) {
      textInputRef.current.focus();
      setIsKeyboardVisible(true);
    }else if(isKeyboardVisible && textInputRef.current) {
      Keyboard.dismiss();
      setIsKeyboardVisible(false);
    }
    //TODO：其他情况下唤起键盘做什么？

  };
  const handleOpenAI = () => {
    // console.log("openAI");
    setIsAIOpen(!isAIOpen);
    onChangeInput('')
  };

  const handleToVoice = () => {
    setIsVoiceBoardOpen(!isVoiceBoardOpen);
  };

  const handleVoiceInput = () => {
    setIsVoiceInput(true);
    //TODO: 接收语音输入
    // Voice.start('en-CN')
  };

  const handleVoiceCancel = () => {
    setIsVoiceInput(false);
    // Voice.stop()
  };

  const handleVoiceOK = () => {
    setIsVoiceInput(false);
    //TODO: 处理语音输入
    // Voice.stop()
  };

  const handleSend = () => {
    setTexts([...texts,input])
    onChangeInput('')
  };

  const [scrollHeight,setScrollHeight] = useState<number|null>(null)


  const [texts, setTexts] = useState<string[]>([
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
    "Last failed login: Tue Jul 25 14:11:59 CST 2023 from 82.207.9.226 on ssh;notty\n" +
    "There were 1268 failed login attempts since the last successful login.\n" +
    "Last login: Mon Jul 24 18:54:40 2023 from 112.96.196.30root@VM-0-16-centos ~]#",
  ])

  const [input, onChangeInput] = useState('')




  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={{ height: "100%", backgroundColor:"black" }}>
        <ImageBackground
          source={require('../../../assets/background_dark.png')} // 指定背景图片的路径
          style={{ flex: 1, resizeMode: 'cover'}}
        >
        <ScrollView style={styles.body}
                    onLayout={(event) => {
                      let {x, y, width, height} = event.nativeEvent.layout;
                      setScrollHeight(height);
                    }}
        >

          {
            texts.map((item, index)=>
              <Text style={styles.text} key={index}>{item}</Text>
            )
          }

          <View style={{height: 200}}></View>



        </ScrollView>
        <FloatingButton handlePress={handleOpenAI} size={50} bottom={scrollHeight} top={80}/>

          {isAIOpen && (isVoiceBoardOpen ?
              (isVoiceInput ?
                <View style={[styles.voiceInputContainer,]}>
                      <TouchableOpacity onPress={handleVoiceCancel} ><Image source={require("../../../assets/cancel_voice.png")} style={styles.icon}/></TouchableOpacity>
                      <Image source={require("../../../assets/voicing.png")} style={styles.icon_large} />
                      <TouchableOpacity onPress={handleVoiceOK} ><Image source={require("../../../assets/ok_voice.png")} style={styles.icon}/></TouchableOpacity>
                </View>
                :
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', height: 40, flexGrow: 0, width: '80%', alignSelf: 'center', /*marginBottom: 15, */position: 'absolute', bottom: 70}}>
                    <View style={styles.inputContainer}>
                      <TouchableOpacity onPress={handleToVoice}>
                        <Image source={require("../../../assets/keyboard.png")} style={{ width: 20, height: 20 }} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.input_new} onLongPress={handleVoiceInput} >
                        <Text style={{ lineHeight: 36, left: 8, }}>{"长按输入语音"}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleSend} style={[styles.sendButton]}>
                      <Text style={{color: 'white', fontSize: 15, fontFamily: 'Source Han Sans CN', fontWeight: '700',}}>发送</Text>
                    </TouchableOpacity>
                  </View>)
              :
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', height: 40, flexGrow: 0, width: '80%', alignSelf: 'center', /*marginBottom: 15, */position: 'absolute', bottom: 70}}>
                <View style={styles.inputContainer}>
                  <TouchableOpacity onPress={handleToVoice}>
                    <Image source={require("../../../assets/voice.png")} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input_new}
                    ref={textInputRef}
                    onChangeText={(text)=>{onChangeInput(text)}}
                    value={input}
                    placeholder={"请输入内容..."}
                  />
                </View>
                <TouchableOpacity onPress={handleSend} style={[styles.sendButton]}>
                  <Text style={{color: 'white', fontSize: 15, fontFamily: 'Source Han Sans CN', fontWeight: '700',}}>发送</Text>
                </TouchableOpacity>
              </View>
          )}


          <View style={styles.bottom}>
            <ScrollView horizontal
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end",}}>
              {/* Virtual keys (Ctrl, ESC, arrows, etc.) */}
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>Ctrl</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>ESC</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>↑</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>↓</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>←</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>→</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F1</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F2</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F3</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F4</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F5</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F6</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F8</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F9</Text></TouchableOpacity>
              <TouchableOpacity style={styles.keyButton}><Text style={styles.keyText}>F10</Text></TouchableOpacity>
            </ScrollView>

            <View>
              <TouchableOpacity onPress={handleKeyboardButtonPress}
                                style={[styles.keyButton,{width: '100%', height:'100%', backgroundColor: 'rgba(0,0,0,0.1)'}]}>
                <Image style={[styles.icon_small,]} source={require("../../../assets/keyboard.png")} />
              </TouchableOpacity>
            </View>

            <SuperModal isModalVisible={isSizeModalVisible}
                        closeModal={() => {setIsSizeModalVisible(false);}}
                        handleConfirm={() => {
                          //setIsSizeModalVisible(false);
                          //TODO: 指定终端界面大小?
                          return true
                        }}
                        text={'长宽比'}
                        Content={<View style={{flexDirection: 'row',width: '90%', marginBottom: 10, alignItems: 'center', justifyContent: 'space-between'}}>
                            <TextInput style={styles.input_size}/>
                            <Text>×</Text>
                            <TextInput style={styles.input_size}/>
                          </View>}
                        confirmText={"确认修改"}
            />

          </View>
          </ImageBackground>
        </View>
    </SafeAreaView>
  );
}

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#EEEEEF',
    fontSize: 25,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '500',

  },
  body: {
    //backgroundColor: "black",
    flex: 1,
    paddingTop: 100,

    paddingHorizontal: 30,
    height: "auto",
    //marginBottom: 50,

    //overflow: 'visible',

  },
  text:{
    color: '#EBE7DB',
    fontSize: 15,
    fontFamily: 'Source Code Pro',
    fontWeight: '400',
    lineHeight: 20,
  },
  icon_large: {
    width: 50,
    height: 50
  },
  icon: {
    width: 40,
    height: 40
  },
  icon_small: {
    width: 30,
    height: 30
  },
  setContainer: {
    //width: "auto"
  },
  modalContainer: {
    alignSelf: "flex-end",
    width: "auto",
    top: 30,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderRadius: 10,
    // backgroundColor: "rgba(255, 255, 255, 1)",
    // borderColor: "grey",
    // borderWidth: 0.5,

    backgroundColor: 'rgba(75.64, 75.64, 75.64, 0.80)',
    elevation: 10,
    borderRadius: 26,
    backdropFilter: 'blur(10px)'
  },
  modalText: {
    marginTop: 5,
    marginBottom: 5,

    textAlign: 'center',
    color: '#EBE7DB',
    fontSize: 13,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%"
    //backgroundColor: "rgba(0, 0, 0, 0.1)",
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexGrow: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  keyButton: {
    borderRadius: 15,
    borderWidth: 1.50,
    borderColor: 'rgba(0, 0, 0, 0.40)',

    width: "auto",
    paddingHorizontal: 12,
    lineHeight: 40,
    marginHorizontal: 2.5,
    justifyContent: 'center',
    alignItems: 'center',

  },
  keyText: {
    color: '#BFBFBF',
    fontSize: 19,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '700',
    lineHeight: 35,
  },
  sendButton: {
    fontSize: 16,
    borderRadius: 20,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,

    backgroundColor: 'rgba(255, 199.77, 138.76, 0.80)',
    height: '100%',
    width: "auto",
    lineHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',

  },
  input: {
    borderRadius: 20,
    flexGrow: 1,
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 10,
    paddingRight: 10,
    // borderColor: "grey",
    // borderWidth: 0.5,
    lineHeight: 30
  },
  input_new: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  voiceInputContainer: {
    alignItems: "center",
    // borderTopLeftRadius: 100,
    // borderTopRightRadius: 100,
    borderRadius: 100,
    marginHorizontal: '5%',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: "rgba(160,160,160,0.8)",

    position: 'absolute',
    width: '90%',
    bottom: 60,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  outputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    padding: 8,
  },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  inputContainer: {
    height: 40,
    lineHeight: 20,

    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    //backgroundColor: '#F7F6F6',
    borderRadius: 20,
    overflow: 'hidden',

    backgroundColor: 'white',
  },
  commandInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
    paddingHorizontal: 8,
  },
  input_size: {
    backgroundColor:'white',
    width: '40%',
    marginHorizontal: 10,
    borderRadius: 15,
    fontSize: 21,
    fontWeight: '400',
    textAlign:'center'
  }

});

