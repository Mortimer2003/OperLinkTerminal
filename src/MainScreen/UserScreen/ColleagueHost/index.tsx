/*同事主机页面（用户主页——企业成员——任意成员栏*/
import {
  Dimensions, FlatList,
  GestureResponderEvent,
  Image, ImageBackground, Keyboard, LayoutAnimation,
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

import { header } from "../../../Components/Header";
import { HostContext, KeyContext, saveData, UserContext } from "../../../../App";
import SuperModal from "../../../Components/SuperModal";
import { HostType, server2host } from "../../../../module/dataModule/types";
import { timeAgo } from "../../../utils/utils";
import { authServer, deleteServer, getServers, getUserServer } from "../../../../module/httpModule/http";

// @ts-ignore
export function ColleagueHostPage({ route, navigation }) {

  const { userSlice, setUserSlice } = useContext(UserContext);
  const [hosts, setHosts] =useState<{items:HostType[],offset:number,end:boolean}>({items:[], offset:0, end:false})

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>{colleague.name}</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true, bottom:true });
  }, []);

  // 读取name与id
  const colleague =  route.params;

  const [onChangeAuthority,setOnChangeAuthority] = useState(-1)

  // @ts-ignore

  const [refreshing, setRefreshing] = useState(false);
  const refresh=()=> {

    if(userSlice.enterprise) {
      setRefreshing(true)
      getUserServer(userSlice.id)
        .then((res) => {
          setHosts({items: res.items.map((item) => server2host(item)) , offset:1, end:res.end})
          setRefreshing(false)
        }).catch();
    }
  }
  useLayoutEffect(() => {
    refresh()
  }, []);

  const [timeNow, setTimeNow] = useState(Date.now())
  useEffect(()=>{
    // console.log('设置定时器')
    let clock = setInterval(()=>{
      setTimeNow(Date.now())
    }, 60*1000);

    return ()=>{
      // console.log("注销定时器")
      clearInterval(clock)
    }
  },[])

  const handleChangeAuthority = (index:number, auth?:1|2|3) => {

    if(index!==-1&&auth){
      if(auth===2)auth=3;
      else if(auth===3)auth=2;

      const newHosts=hosts;
      newHosts.items[index].authority=auth;

      authServer(colleague.id, auth, hosts.items[index].id)
      setHosts(newHosts)
      setOnChangeAuthority(-1)
    }else {
      setOnChangeAuthority(index)
    }
  }

  const handleDelete = (index: number, id: string) => {
    //TODO:处理删除

      const updatedHostList = hosts.items;
      updatedHostList.splice(index, 1);
      setHosts({ ...hosts, items:updatedHostList });

      deleteServer(id).then(()=>{console.log('删除成功')}).catch()

  }

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <ImageBackground
          source={require('../../../../assets/background.png')} // 指定背景图片的路径
          style={{ flex: 1 }}
        >
          {/*<ScrollView style={styles.body} showsVerticalScrollIndicator={false} contentContainerStyle={{overflow: 'hidden',borderRadius: 22,}}>*/}
          {/*  {hosts.map((item: object, index: number) =>*/}
          {/*    <ScrollView horizontal showsHorizontalScrollIndicator={false}*/}
          {/*                contentContainerStyle={{ width: '120%',overflow: 'hidden'}} style={{borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.50)", overflow: 'hidden'}}>*/}
          {/*      <TouchableOpacity*/}
          {/*        activeOpacity={0.5}*/}
          {/*        style={styles.item}*/}
          {/*        onPress={()=>handleChangeAuthority(-1)}*/}
          {/*        key={index}*/}
          {/*      >*/}
          {/*        <View style={{width: 10, height: 10, backgroundColor: 'white', borderRadius: 10, marginRight: 20}} />*/}
          {/*        <View style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>*/}
          {/*          <Text style={{color: 'white', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>{item.nickname || item.username+"@"+item.host}</Text>*/}
          {/*          {timeNow && <Text style={{ color: '#2EB3E0', fontSize: 14, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>{item.time ? timeAgo(timeNow - item.time) : "——"}</Text>}*/}
          {/*        </View>*/}
          {/*        {onChangeAuthority===index?*/}
          {/*          <View style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', width: 60, }}>*/}
          {/*            <TouchableOpacity style={{borderBottomWidth:0.5, borderColor: 'white'}} onPress={()=>handleChangeAuthority(-1)}><Text style={[{fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}, item.authority?{color: '#2EB3E0'}:{color: '#D9D9D9'}]}>管理员</Text></TouchableOpacity>*/}
          {/*            <TouchableOpacity style={{borderTopWidth:0.5, borderColor: 'white'}} onPress={()=>handleChangeAuthority(-1)}><Text style={[{fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}, item.authority?{color: '#D9D9D9'}:{color: '#2EB3E0'}]}>用户</Text></TouchableOpacity>*/}
          {/*          </View>*/}
          {/*          :*/}
          {/*          <TouchableOpacity style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', width: 60, }} onLongPress={()=>handleChangeAuthority(index)}>*/}
          {/*            <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}}>{item.authority?'管理员':'用户'}</Text>*/}
          {/*            <Text style={[{color: '#D9D9D9', fontSize: 11, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}]}>{`(${item.authority?'可读写':'仅可读'})`}</Text>*/}
          {/*          </TouchableOpacity>}*/}
          {/*      </TouchableOpacity>*/}
          {/*      <TouchableOpacity style={{width:'16.5%', backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center'}} onPress={handleDelete}><Text style={{color:'black', fontSize: 18, fontWeight: 'normal'}}>删除</Text></TouchableOpacity>*/}
          {/*    </ScrollView>*/}
          {/*  )}*/}
            <FlatList
              nestedScrollEnabled={true}
              data={hosts.items}
              renderItem={({ item, index }) => (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ width: '120%',overflow: 'hidden'}} style={{borderBottomWidth: 1, borderBottomColor: "rgba(255, 255, 255, 0.50)", overflow: 'hidden'}}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.item}
                    onPress={()=>handleChangeAuthority(-1)}
                    key={index}
                  >
                    <View style={{width: 10, height: 10, backgroundColor: 'white', borderRadius: 10, marginRight: 20}} />
                    <View style={{ display: "flex", flexDirection: "column", flexShrink:1, flexGrow: 1, maxWidth: '80%' }}>
                      <Text style={{color: 'white', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>{item.nickname || item.username+"@"+item.host}</Text>
                      {timeNow && <Text style={{ color: '#2EB3E0', fontSize: 14, fontFamily: 'Microsoft Tai Le', fontWeight: '400',}}>{item.time ? timeAgo(timeNow - item.time) : "——"}</Text>}
                    </View>
                    {onChangeAuthority===index?
                      <View style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', width: 60, }}>
                        {/*<TouchableOpacity style={{borderBottomWidth:0.5, borderColor: 'white'}} onPress={()=>handleChangeAuthority(-1,2)}><Text style={[{fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}, item.authority===2?{color: '#2EB3E0'}:{color: '#D9D9D9'}]}>*/}
                        {/*  管理员*/}
                        {/*</Text></TouchableOpacity>*/}
                        {/*<TouchableOpacity style={{borderTopWidth:0.5, borderColor: 'white'}} onPress={()=>handleChangeAuthority(-1,3)}><Text style={[{fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}, item.authority===3?{color: '#2EB3E0'}:{color: '#D9D9D9'}]}>*/}
                        {/*  用户*/}
                        {/*</Text></TouchableOpacity>*/}
                        <TouchableOpacity style={{borderBottomWidth:0.5, borderColor: 'white'}} onPress={()=>handleChangeAuthority(index,item.authority)}><Text style={[{fontSize: 14, fontFamily: 'Microsoft Tai Le', fontWeight: '800', color: '#D9D9D9', textAlign: 'center'}]}>
                          {item.authority===3?"升级为\n管理员":"降级为\n普通用户"}
                        </Text></TouchableOpacity>
                      </View>
                      :
                      <TouchableOpacity style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', width: 60, }} onLongPress={()=>handleChangeAuthority(index)}>
                        <Text style={{color: '#D9D9D9', fontSize: 18, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}}>{item.authority===2?'管理员':'用户'}</Text>
                        <Text style={[{color: '#D9D9D9', fontSize: 11, fontFamily: 'Microsoft Tai Le', fontWeight: '400'}]}>{`(${item.authority===2?'可读写':'仅可读'})`}</Text>
                      </TouchableOpacity>}
                  </TouchableOpacity>
                  <TouchableOpacity style={{width:'16.5%', backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center'}} onPress={()=>handleDelete(index, item.id)}><Text style={{color:'black', fontSize: 18, fontWeight: 'normal'}}>删除</Text></TouchableOpacity>
                </ScrollView>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.body}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{overflow: 'hidden',borderRadius: 22,}}
              /*onEndReached={()=>{
                if(userSlice.enterprise&&!hosts.end) {
                  setRefreshing(true)
                  getUserServer(userSlice.id)
                    .then((res) => {
                      setHosts({items:[...hosts.items,...res.items.map((item) => server2host(item))], offset:hosts.offset+1, end:res.end})
                    })
                    .finally(() => {
                      setRefreshing(false)
                    })
                }
              }}*/
              onEndReachedThreshold={0.5}
              onRefresh={()=>{refresh()}}
              refreshing={refreshing}
              ListFooterComponent={<View style={{height: 200}}/>}
            />

          {/*</ScrollView>*/}
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
    top: 90,
    width: '90%',
    height: "auto",
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 120,
    flex: 1,
    backgroundColor: 'rgba(90, 90, 90, 0.50)',
    borderRadius: 22,
    backdropFilter: 'blur(4px)',
    elevation: 1,
    overflow: 'hidden'
  },
  item: {
    width: '83.5%',
    minHeight: 80,
    flexDirection: "row",
    // justifyContent: "flex-start",
    justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: 20,
  },

});



