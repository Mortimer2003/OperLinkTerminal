import {
  Image, Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text, View, FlatList,
  TouchableOpacity, TouchableWithoutFeedback,
  useColorScheme,
  Dimensions, ImageBackground, GestureResponderEvent, TextInput
} from "react-native";
import * as React from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { HostContext, KeyContext, saveData } from "../../../../App";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { HostType } from "../../../../module/dataModule/types";
import { timeAgo } from "../../../utils/utils";
import { SuperInput } from "../../../Components/SuperInput";

// @ts-ignore
export function AIChatPage({ route,navigation }) {

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };


  const [isSettingMenuVisible, setIsSettingMenuVisible] = useState(false);
  const [isHostMenuVisible, setIsHostMenuVisible] = useState(false);

  //处理设置点击
  const toggleSettingMenu = () => {
    setIsSettingMenuVisible(!isSettingMenuVisible);
  };

  const handleSetup = () => {
    //跳转到”设置“子页面
    toggleSettingMenu()
    navigation.navigate('Settings')
  };

  const handleHelp = () => {
    //跳转到”帮助“子页面
    toggleSettingMenu()
    navigation.navigate('Assistance')
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>AI小智</Text>
  const headerBackground = () => (
    <ImageBackground
      source={require('../../../../assets/head_background.png')} // 指定背景图片的路径
      style={{ flex: 1 }}
    >
      {/* 在这里添加其他导航栏内容 */}
    </ImageBackground>
  )

  useLayoutEffect(()=>{
    navigation.setOptions({headerTitle,headerBackground})
  },[isSettingMenuVisible])

  //处理加号点击
  const handleAdd = () => {
    //跳转到”新建连接“子页面
    navigation.navigate('NewHost')
  };


  const [selected, setSelected] = useState<{item:HostType|null,index:number|null}>({ item: null, index: null });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 ,over: false});

  const toggleHostMenu = (event: GestureResponderEvent, item: any, index: any) => {
    setSelected({ item, index });
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY, over: false })
    console.log({ pageX, pageY } )
  };

  useEffect(()=>{
    if(selected.item
      && menuPosition.y!==0
    ){
      setIsHostMenuVisible(!isHostMenuVisible);
      console.log("111")
    }

  },[menuPosition])


  const isFocused = useIsFocused();

  const [timeNow, setTimeNow] = useState(Date.now())
  useEffect(()=>{
    console.log('设置定时器')
    let clock = setInterval(()=>{
      setTimeNow(Date.now())
    }, 60*1000);

    return ()=>{
      console.log("注销定时器")
      clearInterval(clock)
    }
  },[])

  const [texts, setTexts] = useState([
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"},
    {text:"对话内容"}
  ])

  const handleSend = (inputValue:string) =>{
    setTexts([...texts, { text: inputValue }])
  }

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <View style={{height: 10}}></View>
          <Text></Text>
          {texts.map((item,index)=>
            <Text key={index}>{item.text}</Text>
          )}
          <View style={{height: 200}}></View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    height: 180,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10
  },
  body: {
    backgroundColor: "#EEEEEF",
    flex: 1,
  },
  icon_large: {
    width: 100,
    height: 100,
  },
  icon: {
    width: 50,
    height: 50,
    padding: 10,
  },
  icon_small: {
    width: 25,
    height: 25,
    margin: 10,
  },
  text1: {
    color: '#484B4B',
    fontSize: 21,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // wordWrap: 'break-word',
  },
  text2: {
    color: '#2EB3E0',
    fontSize: 14,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // wordWrap: 'break-word'
  },
  hostItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    // borderColor: "black",
    //borderWidth: 1,
    //
    marginTop: 15,
    marginBottom: 10,
    padding: 20,

    width: "84%",
    marginLeft: "8%",
    marginRight: "8%",
    height: 94,
    backgroundColor: '#F5F5F5',
    shadowColor: 'rgba(255, 255, 255, 0.50)',
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 27,
  },
  add: {
    position: "absolute",
    right: 10,
    bottom: 100,
    //margin: -20,
    borderRadius: 50,
  },

  sectionTitle: {
    color: '#BFBFBF',
    fontSize: 38,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '700',
    // wordWrap: 'break-word',
    marginLeft: 20,
    // letterSpacing: 5,

  },
  setContainer: {
    width: "auto"
  },
  modalContainer: {
    position: 'absolute',
    alignSelf: "flex-end",
    width: "auto",
    height: 'auto',
    top: 50,
    margin: 10,
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 26,
    backgroundColor: "rgba(75.64, 75.64, 75.64, 0.50)",
    backdropFilter: 'blur(10px)',
  },
  modalText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
    color: "#F5F5F5",
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    // wordWrap: 'break-word',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0)",
  },

  modalTitle: {
    textAlign:'center',
    fontSize: 16,
    marginBottom: 10,
  },
  overlay_popModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200,
  },
  popModal: {
    width: '80%',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#ECECEC',
    // boxShadow: '0px 0px 30px #DADADA',
    borderRadius: 34,
    elevation: 1,
  },
  inputContainer: {
    height: 50,
    lineHeight: 25,
    //flex:1,
    // borderWidth: 1,

    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#F7F6F6',
    borderRadius: 28,
    overflow: 'hidden',
  },
  input_new: {
    flexGrow: 1,
    overflow: 'hidden',
    //backgroundColor: 'pink',
  },
  buttonsContainer: {
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)'
  },
  menuButton: {
    flex: 1,
    //marginTop: 10,
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    borderColor: 'rgba(0,0,0,0.3)'
  },

});

