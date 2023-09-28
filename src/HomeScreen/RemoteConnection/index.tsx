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
import { HostContext, KeyContext, saveData } from "../index";
import { useRoute } from "@react-navigation/native";

// @ts-ignore
export function RemoteConnectionPage({ route,navigation }) {

  //console.log(route.params);

  // @ts-ignore
  const { hostSlice, setHostSlice } = useContext(HostContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const none = {
    state: null,
    time: '',
    protocol: null,
    name: null,
    nickname: '',
    color: 'black',
    encode: null,
    openShell: null,
  };


  const [isSettingMenuVisible, setIsSettingMenuVisible] = useState(false);
  const [isHostMenuVisible, setIsHostMenuVisible] = useState(false);

  //处理设置点击
  const toggleSettingMenu = () => {
    setIsSettingMenuVisible(!isSettingMenuVisible);
  };

  const handleSortByName = () => {
    //TODO：处理按名称排序
    const updatedHostList = hostSlice;
    updatedHostList.sort((a,b)=>{
      let valueA=a.nickname || a.name.username+"@"+a.name.host;
      let valueB=b.nickname || b.name.username+"@"+b.name.host
      if(valueA > valueB) return 1;
      else if(valueA < valueB) return -1;
      else return 0;
    });
    setHostSlice(updatedHostList);
    saveData('HostSlice',updatedHostList)
    setIsSettingMenuVisible(false);
  };

  const handleManagementKey = () => {
    //跳转到”管理秘钥“子页面
    toggleSettingMenu()
    navigation.navigate('ManageKeys')
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

  const headerTitle = () => <Text style={styles.sectionTitle}>主机</Text>
  const headerRight = () => (
    <View style={styles.setContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={toggleSettingMenu}>
        <Image
          style={styles.icon}
          source={require("../../../assets/set.png")}
        />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isSettingMenuVisible}
        onRequestClose={toggleSettingMenu}
      >
        <TouchableOpacity onPress={toggleSettingMenu} style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleSortByName}><Text style={styles.modalText}>按照名称排序{/*SortByName*/}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleManagementKey}><Text style={styles.modalText}>管理秘钥{/*ManagementKey*/}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleSetup}><Text style={styles.modalText}>设置{/*Setup*/}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleHelp}><Text style={styles.modalText}>帮助{/*Help*/}</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
  const headerBackground = () => (
      <ImageBackground
        source={require('../../../assets/head_background.png')} // 指定背景图片的路径
        style={{ flex: 1, resizeMode: 'cover' }}
      >
        {/* 在这里添加其他导航栏内容 */}
      </ImageBackground>
    )


  //处理加号点击
  const handleAdd = () => {
    //跳转到”新建连接“子页面
    navigation.navigate('NewConnection')
  };

  //处理主页栏目点击时对相应主机进行远程连接（跳转到终端页面）
  const handleConnect = (item) => {
    //跳转到终端页面
    navigation.navigate('RemoteOperation',{item})
  };

  useLayoutEffect(()=>{
    navigation.setOptions({headerTitle,headerRight,headerBackground})
  },[isSettingMenuVisible])

  const [selected, setSelected] = React.useState({ item: none, index: null });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 ,over: false});

  const toggleHostMenu = (event: GestureResponderEvent, item: any, index: any) => {
    setSelected({ item, index });
    const { pageX, pageY } = event.nativeEvent;
    //screenHeight-pageY>200 ?
      setMenuPosition({ x: pageX, y: pageY, over: false })
      //:
      //setMenuPosition({ x: pageX, y: 50, over: true })

  };

  useEffect(()=>{
    if(selected.item.name
      && menuPosition.y!==0
    ){
      setIsHostMenuVisible(!isHostMenuVisible);
    }

  },[menuPosition])

  const positioningModeStyle = {top: menuPosition.y}/*menuPosition.over?{bottom: 100}:{top: menuPosition.y}*/

  const handleDelete = () => {
    const updatedHostList = hostSlice;
    updatedHostList.splice(selected.index, 1);
    setHostSlice(updatedHostList);
    saveData('HostSlice',updatedHostList)
    setIsHostMenuVisible(false);
    console.log('删除')
  }

  const [isChangeNicknameModalMenuVisible, setIsChangeNicknameModalMenuVisible] = useState(false);
  const [nicknameNew, onChangeNicknameNew] = React.useState("");

  const handleChangeNicknameMenu = () => {
    setIsChangeNicknameModalMenuVisible(true)
    setIsHostMenuVisible(false);
  }

  const handleChangeNickname = () => {
    const updatedHostList = hostSlice;
    updatedHostList[selected.index].nickname=nicknameNew;
    setHostSlice(updatedHostList);
    saveData('HostSlice',updatedHostList)
    setIsChangeNicknameModalMenuVisible(false);
  }

  const closeChangeNicknameMenu = () => {
    setIsChangeNicknameModalMenuVisible(false);
    onChangeNicknameNew("");
  };

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View /*contentInsetAdjustmentBehavior="automatic"*/ style={backgroundStyle}>
        <ScrollView style={styles.body}>
          <View style={{height: 10}}></View>
          {hostSlice.map((item, index) => {
            let source = item.state
              ? require("../../../assets/OK.png")
              : require("../../../assets/ban.png");
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={()=>handleConnect(item)}
                onLongPress={(event)=>toggleHostMenu(event,item, index)}
                style={styles.hostItem}
                key={index}
              >
                <Image source={source} style={styles.icon_small} />
                <View style={{ display: "flex", flexDirection: "column" }}>
                  <Text style={styles.text1}>{item.nickname || item.name.username+"@"+item.name.host}</Text>
                  <Text style={styles.text2}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{height: 200}}></View>


          <Modal
            transparent={true}
            visible={isHostMenuVisible}
            onRequestClose={() => {
              setIsHostMenuVisible(false);
            }}
          >
            <TouchableOpacity onPress={() => {
              setIsHostMenuVisible(false);
            }} style={styles.overlay}>
              <View style={[styles.modalContainer,positioningModeStyle]}>
                <Text style={{color: "#FFC88B", fontSize: 18}}>{ selected.item.nickname || selected.item.name?.username+"@"+selected.item.name?.host}</Text>
                <TouchableOpacity onPress={() => {
                  handleDelete()
                }}><Text style={styles.modalText}>{"删除主机"}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleChangeNicknameMenu()
                }}><Text style={styles.modalText}>{"修改昵称"}</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* 修改昵称窗口 */}
          <Modal
            transparent={true}
            visible={isChangeNicknameModalMenuVisible}
            onRequestClose={closeChangeNicknameMenu}
          >
            <View style={styles.overlay_popModal}>
              <View style={[styles.popModal]}>
                <Text style={styles.modalTitle}>{"修改昵称"}</Text>
                <View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20,}}>
                    <View style={styles.inputContainer}>
                      <Text>{"新昵称"}：</Text>
                      <TextInput
                        style={styles.input_new}
                        onChangeText={(text)=>onChangeNicknameNew(text)}
                        value={nicknameNew}
                        placeholder={selected.item.nickname}
                      />
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={closeChangeNicknameMenu} style={[styles.menuButton,{borderRightWidth: 0.5}]}>
                    <Text style={{textAlign: 'center'}}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleChangeNickname} style={[styles.menuButton,{borderLeftWidth: 0.5}]}>
                    <Text style={{textAlign: 'center'}}>确认修改</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </ScrollView>
        <TouchableOpacity style={styles.add} onPress={handleAdd}>
          <Image source={require("../../../assets/add.png")} style={styles.icon_large} />
        </TouchableOpacity>

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
    // fontSize: 24,
    // fontWeight: "600",
    // mixBlendMode: 'multiply',
    color: '#BFBFBF',
    fontSize: 38,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '700',
    // wordWrap: 'break-word',
    marginLeft: 20,
    letterSpacing: 20,

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

