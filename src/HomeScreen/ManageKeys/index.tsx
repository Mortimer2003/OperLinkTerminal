import {
  Dimensions,
  GestureResponderEvent,
  Image, ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput, TouchableNativeFeedback,
  TouchableOpacity,
  useColorScheme,
  View
  //Clipboard,
} from "react-native";
import * as React from "react";
import { useLayoutEffect, useEffect, useState, useRef, useContext } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DocumentPicker from "react-native-document-picker";
import Clipboard from "@react-native-clipboard/clipboard";

import { header, KeyContext, saveData } from "../index";
import SuperModal from "../Components/SuperModal";

const screenHeight = Dimensions.get("window").height;

// @ts-ignore
export function ManageKeysPage({ navigation }) {

  // @ts-ignore
  const { keySlice, setKeySlice } = useContext(KeyContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  {/*——————————————————————————————————标头————————————————————————————————————*/}

  //处理加号点击
  const handleAdd = () => {
    //跳转到”生成公钥“子页面
    navigation.navigate("GenerateKey");
  };

  //处理文件上传
  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      });
      // @ts-ignore
      setSelectedFile(result);

      let publicKeyContent = null;
      let privateKeyContent = null;

      for (const file of result) {
        if (file.type === 'text/plain') {
          const content = await fetch(file.uri).then(response => response.text());
          // @ts-ignore
          if (file.name.includes('public_key')) {
            publicKeyContent = content;
          } // @ts-ignore
          else if (file.name.includes('private_key')) {
            privateKeyContent = content;
          }
        }
      }

      //TODO:处理读取到的publicKeyContent/privateKeyContent

    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User canceled the picker
      } else {
        throw error;
      }
    }
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>公钥</Text>;
  const headerRight = () => (
    <View style={styles.headerButtonContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={handleAdd} style={[styles.headerButton,{borderRightWidth: 1,}]}>
        <Image source={require("../../../assets/addKey.png")} style={styles.headerIcon} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.5} onPress={handleUpload} style={[styles.headerButton,{borderLeftWidth: 1,}]}>
        <Image source={require("../../../assets/folder.png")} style={styles.headerIcon} />
      </TouchableOpacity>
    </View>
  );


  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerRight,headerTransparent:true, bottom:true });
  }, []);

  const none = {
    nickname: "",
    type: "",
    digit: null,
    password: "",
    locked: null,
    keyPair: {
      privateKey: "",
      publicKey: ""
    },
    confirmRequired: null,
  };


  const [selected, setSelected] = React.useState({ item: none, index: null });
  const [isUnlockModalVisible, setIsUnlockModalVisible] = React.useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 ,over: false});

  const [password, onChangePassword] = React.useState("");
  const [passwordOld, onChangePasswordOld] = React.useState("");
  const [passwordNew, onChangePasswordNew] = React.useState("");
  const [passwordConfirm, onChangePasswordConfirm] = React.useState("");
  const [unlocktext, setUnlocktext] = React.useState("请输入密码：");
  const [changePasswordtext, setChangePasswordtext] = React.useState("修改密码");

  // const handlePasswordConfirmChange = (value) => {
  //   onChangePasswordConfirm(value);
  //   console.log(passwordConfirm)
  // };

  // const handleUnlock = () => {
  //   // 在解锁窗口中点击解锁后，更新 keyList 中的对应项的 locked 属性为 false
  //   if (password === selected.item.password) {
  //     const updatedKeyList = keySlice;
  //     // @ts-ignore
  //     updatedKeyList[selected.index].locked = false;
  //     setKeySlice(updatedKeyList);
  //     saveData('KeySlice',updatedKeyList)
  //
  //     setIsUnlockModalVisible(false);
  //     onChangePassword("");
  //     setUnlocktext("请输入密码：");
  //   } else {
  //     setUnlocktext("密码错误！");
  //   }
  // };
  useEffect(()=>{
    if(!passwordOld)setChangePasswordtext("修改密码")
  },[passwordOld])





  //@ts-ignore
  const handleItemPress = (item, index) => {
    if (item.locked) {
      if (item.password) {
        setSelected({ item, index });
        setIsUnlockModalVisible(true);
      } else {
        setSelected({ item, index });
        const updatedKeyList = keySlice;
        updatedKeyList[index].locked = false;
        setKeySlice(updatedKeyList);
        saveData('KeySlice',updatedKeyList)
        console.log("解锁");
      }
    } else {
      setSelected({ item, index });
      const updatedKeyList = keySlice;
      updatedKeyList[index].locked = true;
      setKeySlice(updatedKeyList);
      saveData('KeySlice',updatedKeyList)
      console.log("锁定");
    }
  };


  const handleLongPress = (event: GestureResponderEvent, item: any, index: any) => {
    setSelected({ item, index });
    const { pageX, pageY } = event.nativeEvent;
    // console.log({ screenHeight, pageY })
    // console.log({ bottom: screenHeight-pageY - 200, change: screenHeight-pageY<200 ? screenHeight-200 : pageY})
    screenHeight-pageY>200 ?
      setMenuPosition({ x: pageX, y: pageY, over: false })
      :
      setMenuPosition({ x: pageX, y: 50, over: true })
    //console.log(event.nativeEvent.pageY)

  };

  const positioningModeStyle = menuPosition.over?{bottom: 30}:{top: menuPosition.y}

  useEffect(()=>{
    if(selected.item.nickname
      && menuPosition.y!==0
      && !isUnlockModalVisible
      && !isChangePasswordModalVisible
    ){
      setIsMenuVisible(true);
    }

  },[menuPosition])


  const handleCopyKey = () => {
    // 实现复制公钥到剪贴板的逻辑
    //TODO:这里会报错，可能因为模拟器无虚拟键盘，待连接手机测试
    Clipboard.setString(selected.item.keyPair.publicKey);
    console.log('key:'+selected.item.keyPair.publicKey);
    alert('公钥复制成功！');
    setIsMenuVisible(false);
  };

  const handleChangePasswordMenu = () => {
    // 弹出更改密码的弹窗
    setIsChangePasswordModalVisible(true)
    setIsMenuVisible(false);
  };



  const handleToggleConfirmation = () => {
    // 切换使用前确认状态
    const updatedSelectedItem = selected.item;
    updatedSelectedItem.confirmRequired = (selected.item.confirmRequired); //注意这里是=（不是!=）
    setSelected({item: updatedSelectedItem, index: selected.index})

    const updatedKeyList = keySlice;
    updatedKeyList[selected.index].confirmRequired=!selected.item.confirmRequired;
    setKeySlice(updatedKeyList);
    saveData('KeySlice',updatedKeyList)
  };

  const handleDeleteKey = () => {
    // 删除密钥的逻辑
    const updatedKeyList = keySlice;
    updatedKeyList.splice(selected.index, 1);
    setKeySlice(updatedKeyList);
    saveData('KeySlice',updatedKeyList)
    setIsMenuVisible(false);
    console.log('删除')
  };

  const lock_png=require("../../../assets/lock.png");
  const unlock_png=require("../../../assets/unlock.png")

  const changePasswordInputItems=[
    {
      title: "旧密码",
      password: passwordOld,
      onChangePassword: onChangePasswordOld,
      tip: <Image style={[styles.judge,{ opacity: passwordOld ? 1:0}]} source={selected.item.password===passwordOld ? require("../../../assets/correct.png") : require("../../../assets/error.png")} />
    },{
      title: "新密码",
      password: passwordNew,
      onChangePassword: onChangePasswordNew,
      tip: null
    },{
      title: "确认密码",
      password: passwordConfirm,
      onChangePassword: onChangePasswordConfirm,
      tip: <Image style={[styles.judge,{opacity: passwordConfirm ? 1:0}]} source={passwordNew===passwordConfirm ? require("../../../assets/correct.png") : require("../../../assets/error.png")} />
    },
  ]

  // useEffect(()=>{
  //   changePasswordInputItems[0].conditions=(selected.item.password===passwordOld)
  //   changePasswordInputItems[2].conditions=(passwordConfirm===passwordNew)
  //   console.log(changePasswordInputItems[2].conditions)
  // },[passwordConfirm,passwordNew,passwordOld,selected,selected.item])

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View /*contentInsetAdjustmentBehavior="automatic"*/ style={backgroundStyle}>
        <ImageBackground
          source={require('../../../assets/background.png')} // 指定背景图片的路径
          style={{ flex: 1, resizeMode: 'cover'}}
        >
        <ScrollView style={styles.body}>
          {//@ts-ignore
            keySlice.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => handleItemPress(item,index)}
                onLongPress={(event) => handleLongPress(event,item,index)}
                style={styles.item}
                key={index}
              >
                {/*<View>*/}
                  <Image style={[styles.icon,{margin: 10}]} source={item.locked?lock_png:unlock_png}/>
                  <View style={{ display: "flex", flexDirection: "column" }}>
                    <Text style={styles.title1}>{item.nickname}</Text>
                    <Text style={styles.title2}>{item.type+' '+item.digit.toString()+"位" + "("+(item.password?"已加密":"未加密")+")" }</Text>
                  </View>
                {/*</View>*/}

              </TouchableOpacity>
            );
          })}
          <View style={{height:80}}></View>

          <Modal
            transparent={true}
            visible={isMenuVisible}
            onRequestClose={() => {
              setIsMenuVisible(false);
            }}
          >
            <TouchableOpacity onPress={() => {
              setIsMenuVisible(false);
            }} style={styles.overlay}>
              <View style={[styles.modalContainer,positioningModeStyle]}>
                <Text style={{color: "#FFC88B", fontSize: 18}}>{selected.item.nickname}</Text>
                <TouchableOpacity onPress={() => {
                  handleCopyKey()
                }}><Text style={styles.modalText}>{"复制公钥"}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleChangePasswordMenu()
                }}><Text style={styles.modalText}>{"修改密码"}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleToggleConfirmation()
                }}><Text style={styles.modalText}>{"使用前确认"+(selected.item.confirmRequired?" √":"")}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  handleDeleteKey()
                }}><Text style={styles.modalText}>{"删除密钥"}</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>


          {/* 解锁窗口 */}
          <>
          {/*<Modal*/}
          {/*  transparent={true}*/}
          {/*  visible={isUnlockModalVisible}*/}
          {/*  onRequestClose={closeUnlockMenu}*/}
          {/*>*/}
          {/*  <View style={styles.overlay_popModal}>*/}
          {/*    <View style={styles.popModal}>*/}
          {/*      <Text style={styles.modalTitle}>{unlocktext}</Text>*/}
          {/*      <TextInput*/}
          {/*        secureTextEntry={true}*/}
          {/*        style={styles.input}*/}
          {/*        onChangeText={text => onChangePassword(text)}*/}
          {/*        value={password}*/}
          {/*        placeholder={"密码"}*/}
          {/*      />*/}
          {/*      <View style={styles.buttonsContainer}>*/}
          {/*        <TouchableOpacity onPress={closeUnlockMenu} style={[styles.menuButton,{borderRightWidth: 0.5}]}>*/}
          {/*          <Text style={{textAlign: 'center'}}>取消</Text>*/}
          {/*        </TouchableOpacity>*/}
          {/*        <TouchableOpacity onPress={handleUnlock} style={[styles.menuButton,{borderLeftWidth: 0.5}]}>*/}
          {/*          <Text style={{textAlign: 'center'}}>解锁密钥</Text>*/}
          {/*        </TouchableOpacity>*/}
          {/*      </View>*/}

          {/*    </View>*/}
          {/*  </View>*/}
          {/*</Modal>*/}
          </>
          <SuperModal isModalVisible={isUnlockModalVisible}
                      closeModal={() => {
                        setIsUnlockModalVisible(false);
                        onChangePassword("");
                        setUnlocktext("请输入密码：");
                      }}
                      handleConfirm={() => {
                          // 在解锁窗口中点击解锁后，更新 keyList 中的对应项的 locked 属性为 false
                          if (password === selected.item.password) {
                            const updatedKeyList = keySlice;
                            // @ts-ignore
                            updatedKeyList[selected.index].locked = false;
                            setKeySlice(updatedKeyList);
                            saveData('KeySlice',updatedKeyList)

                            //setIsUnlockModalVisible(false);
                            onChangePassword("");
                            setUnlocktext("请输入密码：");
                            return true
                          } else {
                            setUnlocktext("密码错误！");
                            return false
                          }
                      }}
                      text={unlocktext}
                      Content={
                        <View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20,}} >
                          <View style={styles.inputContainer}>
                            <Text>{"密码"}：</Text>
                            <TextInput
                              style={{flexGrow:1}}
                              secureTextEntry={true}
                              onChangeText={text => onChangePassword(text)}
                              value={password} />
                          </View>
                        </View>}
                      confirmText={"解锁密钥"}
          />

          {/* 修改密码窗口 */}
          <>
          {/*<Modal*/}
          {/*  transparent={true}*/}
          {/*  visible={isChangePasswordModalVisible}*/}
          {/*  onRequestClose={closeChangePasswordMenu}*/}
          {/*>*/}
          {/*  <View style={styles.overlay_popModal}>*/}
          {/*    <View style={[styles.popModal]}>*/}
          {/*      <Text style={styles.modalTitle}>{changePasswordtext}</Text>*/}
          {/*      {changePasswordInputItems.map((item,index)=>{*/}
          {/*        if(!selected.item.password&&item.title==="旧密码")return null;*/}

          {/*        return <View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20,}} key={index}>*/}
          {/*          <View style={styles.inputContainer}>*/}
          {/*            <Text>{item.title}：</Text>*/}
          {/*            <TextInput*/}
          {/*              secureTextEntry={true}*/}
          {/*              style={styles.input_new}*/}
          {/*              onChangeText={(text)=>item.onChangePassword(text)}*/}
          {/*              value={item.password}*/}
          {/*            />*/}
          {/*          </View>*/}
          {/*          {item.tip}*/}
          {/*        </View>*/}
          {/*      })}*/}

          {/*      <View style={styles.buttonsContainer}>*/}
          {/*        <TouchableOpacity onPress={closeChangePasswordMenu} style={[styles.menuButton,{borderRightWidth: 0.5}]}>*/}
          {/*          <Text style={{textAlign: 'center'}}>取消</Text>*/}
          {/*        </TouchableOpacity>*/}
          {/*        <TouchableOpacity onPress={handleChangePassword} style={[styles.menuButton,{borderLeftWidth: 0.5}]}>*/}
          {/*          <Text style={{textAlign: 'center'}}>确认修改</Text>*/}
          {/*        </TouchableOpacity>*/}
          {/*      </View>*/}

          {/*    </View>*/}
          {/*  </View>*/}
          {/*</Modal>*/}
          </>
          <SuperModal isModalVisible={isChangePasswordModalVisible}
                      closeModal={ () => {
                        setIsChangePasswordModalVisible(false);
                        onChangePasswordOld("");
                        onChangePasswordNew("");
                        onChangePasswordConfirm("");
                        setChangePasswordtext("修改密码");
                      }}
                      handleConfirm={() => {
                        // 处理密码更改
                        //检验old、new、confirm
                        //失败情况：
                        if(selected.item.password!==passwordOld){setChangePasswordtext('密码错误！');return false;}
                        if(passwordNew!==passwordConfirm){return false;}

                        //成功情况：
                        const updatedKeyList = keySlice;
                        updatedKeyList[selected.index].password=passwordNew;
                        setKeySlice(updatedKeyList);
                        saveData('KeySlice',updatedKeyList)

                        //closeChangePasswordMenu();
                        return true;

                      }}
                      text={changePasswordtext}
                      Content={<>
                        {changePasswordInputItems.map((item,index)=>{
                            if(!selected.item.password&&item.title==="旧密码")return null;

                            return <View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20,}} key={index}>
                              <View style={styles.inputContainer}>
                                <Text>{item.title}：</Text>
                                <TextInput
                                  secureTextEntry={true}
                                  style={styles.input_new}
                                  onChangeText={(text)=>item.onChangePassword(text)}
                                  value={item.password}
                                />
                              </View>
                              {item.tip}
                            </View>
                          })}
                        </>}
                      confirmText={"确认修改"}
          />


        </ScrollView>
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
  icon: {
    width: 50,
    height: 50
  },
  body: {
    top: 150,
    width: '90%',
    height: "auto",
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 180,
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
  },
  item: {
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 20,

    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.50)",

  },
  title1: {
    color: '#F5F5F5',
    fontSize: 21,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
  },
  title2: {
    color: '#BFBFBF',
    fontSize: 13,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
  },

  // input_passwordChange: {
  //   height: 50,
  //   width: "70%",
  //   lineHeight: 25,
  //   borderColor: "gray",
  //   borderWidth: 1,
  //   margin: 5
  // },
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
  // input: {
  //   height: 50,
  //   lineHeight: 25,
  //   // borderWidth: 1,
  //   marginBottom: 20,
  //   paddingLeft: 15,
  //
  //   width: '90%',
  //   backgroundColor: '#F7F6F6',
  //   borderRadius: 28
  // },
  judge:{
    width: 20,
    height: 20,
    position:'absolute',
    right:-20,
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
  modalContainer: {
    position: 'absolute',
    alignSelf: "flex-end",
    width: "30%",
    height: 170,
    right: '5%',
    marginRight: 1,

    padding: 10,
    paddingLeft: 20,
    zIndex: 100,

    backgroundColor: 'rgba(180, 180, 180, 0.60)',
    borderRadius: 26,
    backdropFilter: 'blur(10px)'
  },
  modalText: {
    marginTop: 5,
    marginBottom: 5,
    color: '#F0ECE7',
    fontSize: 16,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    // wordWrap: 'break-word'
  },
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    //backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  headerButtonContainer: {
    width: '100%',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerButton: {
    flex:1,
    alignItems:'center',
    //paddingHorizontal: 10,
    borderColor: 'rgba(0,0,0,0.3)'
  },
  headerIcon: {
    width: 30, height: 30, margin: 15,
  }
});

