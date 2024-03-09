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
import { HostContext, KeyContext, saveData, UserContext } from "../../../../App";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { HostType, Server, server2host, User } from "../../../../module/dataModule/types";
import { timeAgo } from "../../../utils/utils";
import {
  connectInit,
  deleteServer,
  getApplications,
  getServers,
  getUsers,
  getUserServer
} from "../../../../module/httpModule/http";
import { styles } from "./styles";
import SuperModal from "../../../Components/SuperModal";

// @ts-ignore
export function RemoteConnectionPage({ route,navigation }) {

  //console.log(route.params);

  // @ts-ignore
  // const { hostSlice, setHostSlice } = useContext(HostContext);
  const { userSlice, setUserSlice } = useContext(UserContext);
  const [hosts, setHosts] =useState<{items:HostType[],offset:number,end:boolean}>({items:[], offset:0, end:false})

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };


  const [isSettingMenuVisible, setIsSettingMenuVisible] = useState(false);
  const [isHostMenuVisible, setIsHostMenuVisible] = useState(false);
  // const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);

  //处理设置点击
  const toggleSettingMenu = () => {
    setIsSettingMenuVisible(!isSettingMenuVisible);
  };

  const handleSortByName = () => {
    //处理按名称排序
    //const updatedHostList = hostSlice;
    const updatedHostList = hosts.items;
    updatedHostList.sort((a,b)=>{
      let valueA=a.nickname || a.username+"@"+a.host;
      let valueB=b.nickname || b.username+"@"+b.host;
      if(valueA > valueB) return 1;
      else if(valueA < valueB) return -1;
      else return 0;
    });
    setHosts({ ...hosts, items:updatedHostList });
    // saveData('HostSlice',updatedHostList)
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

  const [refreshing, setRefreshing] = useState(false);
  const refresh=()=> {
    if(userSlice.enterprise) {
      setRefreshing(true)
      getUserServer(userSlice.id)
        .then((res) => {
          setHosts({items: res.items.map((item) => server2host(item)) , offset:1, end:res.end})
          setRefreshing(false)
        }).catch();
    }else setRefreshing(false)
  }

  const isFocused = useIsFocused();
  /*获取主机列表*/
  useLayoutEffect(() => {
    refresh()
  }, [userSlice.id,userSlice.enterprise?.id, isFocused]);

  const headerTitle = () => <Text style={styles.sectionTitle}>主机</Text>
  const headerRight = () => (
    <View style={styles.setContainer}>
      <TouchableOpacity activeOpacity={0.5} onPress={toggleSettingMenu}>
        <Image
          style={styles.icon}
          source={require("../../../../assets/set.png")}
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
            {/*<TouchableOpacity onPress={handleManagementKey}><Text style={styles.modalText}>管理秘钥/!*ManagementKey*!/</Text></TouchableOpacity>*/}
            <TouchableOpacity onPress={handleSetup}><Text style={styles.modalText}>设置{/*Setup*/}</Text></TouchableOpacity>
            <TouchableOpacity onPress={handleHelp}><Text style={styles.modalText}>帮助{/*Help*/}</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
  const headerBackground = () => (
      <ImageBackground
        source={require('../../../../assets/head_background.png')} // 指定背景图片的路径
        style={{ flex: 1 }}
      >
        {/* 在这里添加其他导航栏内容 */}
      </ImageBackground>
  )

  useLayoutEffect(()=>{
    navigation.setOptions({headerTitle,headerRight,headerBackground})
  },[isSettingMenuVisible])

  //处理加号点击
  const handleAdd = () => {
    //跳转到”新建连接“子页面
    navigation.navigate('NewHost')
  };

  //处理主页栏目点击时对相应主机进行远程连接（跳转到终端页面）
  const handleConnect = (item: HostType, index: number) => {
    navigation.navigate('RemoteOperation',{item,index})
    // if(item.connecting){
    //   //跳转到终端页面
    //   navigation.navigate('RemoteOperation',{item,index})
    // } else {
    //   //TODO:先验证再连接
    //   setSelected({ item, index });
    //   setIsVerificationModalVisible(true)
    //   // const updatedHostList = hosts.items;
    //   // updatedHostList[index].connecting=true;
    //   // updatedHostList[index].texts=[(item.nickname||(item.username+item.host))+",测试用预置文本"]; //TODO:设置预置文本
    //   // setHosts({ ...hosts, items:updatedHostList });
    //   // // saveData('HostSlice',updatedHostList)
    //   //
    //   // navigation.navigate('RemoteOperation',{item,index})
    // }
  };

  // const [passwordInput, setPasswordInput] = useState('');
  // const handleHostVerification = async () => {
  //   if (!selected.item || selected.index===null||selected.index===-1) return true;
  //   try {
  //     const SSHSessionID = await connectInit(selected.item?.host, selected.item?.username, passwordInput)
  //     const updatedHostList = hosts.items;
  //     updatedHostList[selected.index].connecting=true;
  //     updatedHostList[selected.index].texts=[(selected.item.nickname||(selected.item.username+selected.item.host))+",测试用预置文本"]; //TODO:设置预置文本
  //     setHosts({ ...hosts, items:updatedHostList });
  //     // saveData('HostSlice',updatedHostList)
  //     navigation.navigate('RemoteOperation',{item:selected.item,index:selected.index})
  //     //TODO: 在本地缓存连接状态、对话数据等信息（注意考虑什么时候才更新缓存）
  //     return true
  //   } catch {
  //     return false
  //   }
  //
  // }


  const [selected, setSelected] = useState<{item:HostType|null,index:number|null}>({ item: null, index: null });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 ,over: false});

  const toggleHostMenu = (event: GestureResponderEvent, item: any, index: any) => {
    if(userSlice.level===3) return;
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
    }

  },[menuPosition])

  const positioningModeStyle = {top: menuPosition.y, right: 20}/*menuPosition.over?{bottom: 100}:{top: menuPosition.y}*/

  const handleDelete = () => {
    if(selected.index !== null && selected.item){
      const updatedHostList = hosts.items;
      updatedHostList.splice(selected.index, 1);
      setHosts({ ...hosts, items:updatedHostList });
      // saveData('HostSlice',updatedHostList)
      setIsHostMenuVisible(false);
      deleteServer(selected.item.id).then(()=>{console.log('删除成功')}).catch()
    }
  }

  // const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // const [nicknameNew, onChangeNicknameNew] = React.useState("");

  const handleEdit = () => {
    // setIsEditModalVisible(true)
    navigation.navigate('EditHost', selected)
    setIsHostMenuVisible(false);
  }

  // useEffect(() => {
  //   console.log("重新渲染") //用于在hostSlice更新时强制刷新
  // }, [hostSlice,/*navigation,isFocused,*/]);

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


  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View /*contentInsetAdjustmentBehavior="automatic"*/ style={backgroundStyle}>
        <View style={{height: 10}}></View>
        <FlatList
          nestedScrollEnabled={true}
          data={hosts.items}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={()=>handleConnect(item,index)}
              onLongPress={(event)=>toggleHostMenu(event,item, index)}
              style={styles.hostItem}
              key={index}
            >
              <Image source={
                  item.connecting
                  ? require("../../../../assets/OK.png")
                  : require("../../../../assets/ban.png")
              } style={styles.icon_small} />
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={[styles.text1,{color: item.color}]}>{item.nickname || item.username+"@"+item.host}</Text>
                {timeNow && <Text style={styles.text2}>{item.time ? timeAgo(timeNow - item.time) : "——"}</Text>}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.body}
          showsVerticalScrollIndicator={false}
          onStartReached={()=>{refresh()}}
          // onEndReached={()=>{
          //   if(userSlice.enterprise&&!hosts.end) {
          //     setRefreshing(true)
          //     getServers(userSlice.enterprise.id, hosts.offset)
          //       .then((res) => {
          //         setHosts({items:[...hosts.items,...res.items.map((item) => server2host(item))], offset:hosts.offset+1, end:res.end})
          //       })
          //       .finally(() => {
          //         setRefreshing(false)
          //       })
          //   }
          // }}
          onEndReachedThreshold={0.5}
          onRefresh={()=>{refresh()}}
          refreshing={refreshing}
          ListFooterComponent={<View style={{height: 200}}/>}
        />
        {/*<View style={{height: 200}}></View>*/}
        {/*<ScrollView style={styles.body} showsVerticalScrollIndicator={false}>*/}
          {/*<View style={{height: 10}}></View>*/}
          {/*{hosts.items.map((item: HostType, index: number) => {*/}
          {/*  let source = item.connecting*/}
          {/*    ? require("../../../../assets/OK.png")*/}
          {/*    : require("../../../../assets/ban.png");*/}
          {/*  return (*/}
          {/*    <TouchableOpacity*/}
          {/*      activeOpacity={0.5}*/}
          {/*      onPress={()=>handleConnect(item,index)}*/}
          {/*      onLongPress={(event)=>toggleHostMenu(event,item, index)}*/}
          {/*      style={styles.hostItem}*/}
          {/*      key={index}*/}
          {/*    >*/}
          {/*      <Image source={source} style={styles.icon_small} />*/}
          {/*      <View style={{ display: "flex", flexDirection: "column" }}>*/}
          {/*        <Text style={[styles.text1,{color: item.color}]}>{item.nickname || item.username+"@"+item.host}</Text>*/}
          {/*        {timeNow && <Text style={styles.text2}>{item.time ? timeAgo(timeNow - item.time) : "——"}</Text>}*/}
          {/*      </View>*/}
          {/*    </TouchableOpacity>*/}
          {/*  );*/}
          {/*})}*/}
          {/*<View style={{height: 200}}></View>*/}

          {/*仅管理员*/}


        {/*</ScrollView>*/}
        <Modal
          transparent={true}
          visible={isHostMenuVisible && userSlice.level<3}
          onRequestClose={() => {
            setIsHostMenuVisible(false);
          }}
        >
          <TouchableOpacity onPress={() => {
            setIsHostMenuVisible(false);
          }} style={styles.overlay}>
            <View style={[styles.modalContainer,positioningModeStyle]}>
              {selected.item && <Text style={{color: "#FFC88B", fontSize: 18}} numberOfLines={1} ellipsizeMode='tail'>{ selected.item.nickname || selected.item.username+"@"+selected.item.host}</Text>}
              <TouchableOpacity onPress={() => {
                handleEdit()
              }}><Text style={styles.modalText}>{"编辑主机"}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                handleDelete()
              }}><Text style={styles.modalText}>{"删除主机"}</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/*<SuperModal isModalVisible={isVerificationModalVisible} title={"请输入密码"} closeModal={()=>{setIsVerificationModalVisible(false);setPasswordInput('')}} handleConfirm={handleHostVerification}*/}
        {/*            content={<View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20, width: '85%', flexShrink: 1, height: 50, backgroundColor: '#F7F6F6', borderRadius: 28, overflow: 'hidden',}}>*/}
        {/*              <TextInput*/}
        {/*                secureTextEntry={true}*/}
        {/*                style={{overflow: 'hidden',textAlign:'center', flexGrow: 1}}*/}
        {/*                onChangeText={(text)=>setPasswordInput(text)}*/}
        {/*                value={passwordInput}*/}
        {/*              />*/}

        {/*              </View>}*/}
        {/*/>*/}

        {/*仅管理员*/}
        {userSlice.level<3 && <TouchableOpacity style={styles.add} onPress={handleAdd}>
          <Image source={require("../../../../assets/add.png")} style={styles.icon_large} />
        </TouchableOpacity>}

      </View>


    </SafeAreaView>
  );
}

