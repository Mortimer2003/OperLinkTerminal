import {
  Button,
  Dimensions,
  Image, ImageBackground, Keyboard, LayoutAnimation, Modal,
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
import FloatingButton from "../../../Components/FloatingButton";
import { header } from "../../../Components/Header";
import SuperModal from "../../../Components/SuperModal";
import Clipboard from '@react-native-clipboard/clipboard';
import { HostContext, saveData } from "../../../../App";
import { SuperInput } from "../../../Components/SuperInput";
import { connectInit } from "../../../../module/httpModule/http";
import { Terminal } from "xterm";


// @ts-ignore
export function RemoteOperationPage({ route, navigation }) {
  const { item, index } = route.params;

  // @ts-ignore
  const { hostSlice, setHostSlice } = useContext(HostContext);

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
      //const content = value;
      //console.log({ content })
      onChangeInputDirect(inputDirect+value)
    });

    setIsMenuVisible(!isMenuVisible);
  };

  const handleDisconnect = () => {
    //断开与此服务器的连接，断开连接后，返回主界面
    setIsMenuVisible(!isMenuVisible);
    //断开连接
    const updatedHostList = hostSlice;
    updatedHostList[index].texts = [];
    updatedHostList[index].connecting = false;
    setHostSlice(updatedHostList);
    // saveData('HostSlice',updatedHostList)

    ws.current?.close()

    navigation.goBack();
  };

  const handleSpecifySize = () => {
    //指定终端窗口的大小
    setIsMenuVisible(!isMenuVisible);
    setIsSizeModalVisible(true)
  };

  const headerTitle = () => <Text style={[styles.sectionTitle]}>{item.username + "@" + item.host}</Text>;
  const headerRight = () => (
    <View style={styles.setContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={toggleMenu}>
        <Image
          style={styles.icon}
          source={require("../../../../assets/menu.png")}
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

  const [isAIOpen, setIsAIOpen] = useState(false);
  // const [isVoiceBoardOpen, setIsVoiceBoardOpen] = useState(false);
  // const [isVoiceInput, setIsVoiceInput] = useState(false);

  const [isSizeModalVisible,setIsSizeModalVisible] = useState(false)

  const directInputRef = useRef(null);
  const aiInputRef = useRef(null);
  const [inputDirect, onChangeInputDirect] = useState('')
  // const [inputAI, onChangeInputAI] = useState('')

  const [scrollHeight,setScrollHeight] = useState<number|null>(null)
  // const [renew,setRenew]=useState(false)
  const [editable,setEditable]=useState(true)

  const [texts, setTexts] = useState<string[]>(item.texts)

  // const [isWaitingPassword, setIsWaitingPassword] = useState(false)
  const [sshSessionID, setSSHSesionID] = useState('')

  const ws= useRef<WebSocket>()

  useLayoutEffect(()=>{
    if(!item.connecting){
      setTexts(['请输入密码：'])
      setSSHSesionID('')
      // setIsWaitingPassword(true)
    }
  },[item.connecting])

  useEffect(() => {

    //监听键盘弹出
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if(directInputRef.current.isFocused()){
          setTerminalState('Inputting')
        }
      }
    );

    //监听键盘收起
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Keyboard.dismiss();
      }
    );

    // 返回一个清理函数以在组件卸载时取消监听
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const handleKeyboardButtonPress = () => {
    let textInputRef = isAIOpen ? aiInputRef : directInputRef;
    // console.log(textInputRef.current?.isFocused())
    if (aiInputRef.current?.isFocused()||directInputRef.current?.isFocused()) {
      Keyboard.dismiss();
    } else {
      textInputRef.current.focus();
    }
  };
  const handleOpenAI = () => {
    setIsAIOpen(!isAIOpen);
    // onChangeInputAI('')
  };

  useEffect(()=>{
    if(isAIOpen) {
      aiInputRef.current?.focus();
    }
  },[isAIOpen])

  const handleAISend = (inputAI:string) => {
    // setTexts([...texts,inputAI])
    onChangeInputDirect(inputDirect+inputAI)
    // onChangeInputAI('')
  };

  const [terminalState, setTerminalState] = useState<'Waiting'|'Inputting'|'Sending'>('Waiting')

  const openWS = (ssh) => {
    ws.current=new WebSocket('/api/terminal/sshConnect');
    ws.current.onopen = () => {
      ws.current?.send(ssh);
    };
    ws.current.onmessage = (event) => {
      if(terminalState==='Sending') {
        setTexts([...texts,'event.data'])
        onChangeInputDirect('')
        setTerminalState('Waiting')
      }
    };
  }

  const handleDirectSend = (e) => {
    // 对于安卓，回车键的键码通常是 13
    if ( e.nativeEvent.key === 'Enter' && terminalState!=='Sending') {

      setTerminalState('Sending')
      setTexts([...texts,inputDirect])

      // setRenew(true)
    }
  };

  useEffect(()=>{
    switch(terminalState){
      case "Inputting": {
        console.log("输入中")
        break;
      }
      case "Sending": {
        //TODO: 请求inputDirect的返回结果
        // setTerminalState('Outputting')
        // setTexts([...texts,'result'])
        if(!sshSessionID){
          connectInit(item.host, item.username, inputDirect)
            .then((res)=>{
              openWS(res)
              setSSHSesionID(res)
              //TODO：将isConnecting改为true
              onChangeInputDirect('')
              setTexts([...texts,'连接成功！'])
              setTerminalState('Waiting')
            })
            .catch(()=>{
              setTexts([...texts,'密码错误！请重新输入：'])
              onChangeInputDirect('')
              setTerminalState('Waiting')
            })
        } else {
          ws.current?.send(inputDirect)
        }
        console.log("发送中")
        break;
      }
      case "Waiting": {
        console.log("等待中")
        break;
      }
    }

  },[terminalState])

  const handleSelectionChange = (event) => {
    const { start, end }:{ start: number, end: number } = event.nativeEvent.selection;
    //console.log(start)
    // setSelection({ start: start>=2?start:2, end });
    if(start<2||end<2){
      directInputRef.current.setNativeProps({
        selection: { start: 2, end: 2 },
      });
      setEditable(false)
    } else setEditable(true)
  };


  useEffect(()=>{
    const updatedHostList = hostSlice;
    updatedHostList[index].texts = texts
    setHostSlice(updatedHostList);
    // saveData('HostSlice',updatedHostList)
  },[texts])

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={{ height: "100%", backgroundColor:"black" }}>
        <ImageBackground
          source={require('../../../../assets/background_dark.png')} // 指定背景图片的路径
          style={{ flex: 1 }}
        >
        <ScrollView style={styles.body}
                    onLayout={(event) => {
                      let {x, y, width, height} = event.nativeEvent.layout;
                      setScrollHeight(height);
                    }}
                    showsVerticalScrollIndicator={false}
        >

          {
            texts.map((item, index)=>
              <Text style={styles.text} key={index}>{"=>"+item}</Text>
            )
          }

          {(terminalState==='Waiting'||terminalState==='Inputting') && <TextInput ref={directInputRef} style={[styles.text, {  padding:0, margin: 0, }]}
                       value={/*renew?"=>":*/"=>"+inputDirect}
                       onChangeText={(text)=> {
                         if(editable && text[text.length-1]!=='\n'){
                           onChangeInputDirect(text.slice(2));
                         }
                       }}
                       onSelectionChange={handleSelectionChange}
                       onKeyPress={handleDirectSend}
                       multiline={true}/>
          }

          <View style={{height: 200}}></View>



        </ScrollView>
        <FloatingButton handlePress={handleOpenAI} size={50} bottom={scrollHeight} top={80}/>

        {isAIOpen && <SuperInput width={'80%'} bottom={70} handleSend={handleAISend} buttonColor={'rgba(255, 199.77, 138.76, 0.80)'} inputRef={aiInputRef}/>}

          <View style={styles.bottom}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
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
                <Image style={[styles.icon_small,]} source={require("../../../../assets/keyboard.png")} />
              </TouchableOpacity>
            </View>

            <SuperModal isModalVisible={isSizeModalVisible}
                        closeModal={() => {setIsSizeModalVisible(false);}}
                        handleConfirm={() => {
                          //TODO: 指定终端界面大小?
                          return true
                        }}
                        title={'长宽比'}
                        content={<View style={{flexDirection: 'row',width: '90%', marginBottom: 10, alignItems: 'center', justifyContent: 'space-between'}}>
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

  outputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    padding: 8,
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




