import { memo, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { saveData, UserContext } from "../../../../App";
import {
  Alert,
  Dimensions, FlatList,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { defaultUserSlice } from "../../../../module/dataModule/dataSlice";
import * as React from "react";
import SuperModal from "../../../Components/SuperModal";
import { StackActions } from "@react-navigation/native";
import {
  applyEnterprise, authAdmin,
  changeEnterprise, getApplications, getEnterprises, getUserEnterprises, getUsers,
  sendCode,
  updateNickname,
  updatePassword,
  updatePhone
} from "../../../../module/httpModule/http";
import { Enterprise, User } from "../../../../module/dataModule/types";
import { styles } from "./styles";
// import * as url from "url";

// @ts-ignore
export function MyHomePage({ route,navigation }) {
  const { userSlice, setUserSlice } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(userSlice.isLogin)

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };


  const [isSettingMenuVisible, setIsSettingMenuVisible] = useState(false);

  //处理设置点击
  const toggleSettingMenu = () => {
    setIsSettingMenuVisible(!isSettingMenuVisible);
  };

  const handleLogout=()=>{
    setUserSlice(defaultUserSlice);
    saveData('UserSlice',defaultUserSlice)
    setIsLogin(false);
    // navigation.navigate('Login').catch((reason)=>{console.log("不能返回login页面")})
  }

  const handleLogin=()=>{
    //navigation.navigate('SplashScreen')//.catch((err)=>{console.log("不能返回login页面")})
    //navigation.dispatch(StackActions.popToTop())
    //TODO: 跳转到登录页！！！
    // console.log({ navigation })
    // console.log(userSlice)//已更新
    navigation.popToTop()
  }

  const headerTitle = () => <Text style={styles.sectionTitle}>我的</Text>
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
            <TouchableOpacity onPress={()=>{handleEdit('EditPassword')}}><Text style={styles.modalText}>修改密码</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{handleEdit('EditNickname')}}><Text style={styles.modalText}>修改昵称</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{handleEdit('EditPhone')}}><Text style={styles.modalText}>修改手机</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{handleEdit('ToggleEnterPrise')}}><Text style={styles.modalText}>切换企业</Text></TouchableOpacity>
            {isLogin?
              <TouchableOpacity onPress={handleLogout}><Text style={styles.modalText}>退出登录</Text></TouchableOpacity>
              :
              <TouchableOpacity onPress={handleLogin}><Text style={styles.modalText}>账号登录</Text></TouchableOpacity>
            }
            {/*TODO:测试用*/}
            {userSlice.level===3?
              <TouchableOpacity onPress={()=>{setUserSlice({...userSlice,level: 1});saveData('UserSlice',{...userSlice,level: 1});toggleSettingMenu()}}><Text style={styles.modalText}>UP(test)</Text></TouchableOpacity>
              :
              <TouchableOpacity onPress={()=>{setUserSlice({...userSlice,level: 3});saveData('UserSlice',{...userSlice,level: 3});toggleSettingMenu()}}><Text style={styles.modalText}>DW(test)</Text></TouchableOpacity>
            }
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )

  useLayoutEffect(()=>{
    navigation.setOptions({headerTitle,headerRight, headerTransparent:true})
  },[isSettingMenuVisible,isLogin])

  const handleEdit = (type: "None" | "EditPassword" | "EditNickname" | "EditPhone" | "ToggleEnterPrise") => {
    setModalVisible(type);
    setIsSettingMenuVisible(false);
  };

  const tags=['企业成员','人员审核']
  const [current, setCurrent] = useState(0) //当前分页（'企业成员'|'人员审核'）
  // const [enterpriseName, setEnterpriseName] = useState("个人")//"企业名称"
  //企业成员，state为空
  const [enterpriseMembers, setEnterpriseMembers] =useState<{items:User[],offset:number,end:boolean}>({items:[], offset:0, end:false})
  //申请列表，state依次为2/3/1
  const [applicants, setApplicants] =useState<{items:Array<User&{state:number}>, state: number, offset:number, end:boolean}>({items:[], state: 2, offset:0, end:false})
  // const [users, setUsers] = useState<Array<{items:Array<User&{state:number}>,offset:number}>>([{items:[],offset:0},{items:[],offset:0},{items:[],offset:0},{items:[],offset:0}])
  const [refreshing, setRefreshing] = useState(false);
  // const [offset, setOffset] = useState(0);

  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)
  const [authChoice, setAuthChoice] = useState<{id:string,name:string,type:number/*2|3*/}>({id:'',name:'',type:3})

  const refresh=()=> {
    if(userSlice.enterprise) {
      setRefreshing(true)
      getUsers(userSlice.enterprise.id)
        .then((res) => {
          // const newUsers=users;
          // newUsers[1]={items:res[0],offset:1}
          // setUsers(newUsers)
          setEnterpriseMembers({items:res.items, offset:1, end:res.end})
          setRefreshing(false)
        }).catch();
      if(userSlice.level===1){
        getApplications(userSlice.enterprise.id)
          .then((res) => {
            // const newUsers=users;
            // newUsers[2]={items:res,offset:1}
            // setUsers(newUsers)
            setApplicants({items:res, state: 3, offset:0, end:false})
            //TODO:如果待审核(2)人数较少，可以直接请求3/1
            setRefreshing(false)
          }).catch();
      }
    }
      // if (userSlice.enterprise) {
      //   setRefreshing(true)
      //
      //   Promise.all([
      //     getUsers(userSlice.enterprise.id, [1]),
      //     getApplications(userSlice.enterprise.id),
      //     getUsers(userSlice.enterprise.id, [3])
      //   ]).then(([usersRes1, applicationsRes, usersRes3]) => {
      //     const newUsers = { ...users }; // 创建users的浅拷贝
      //     newUsers[1] = { items: usersRes1[0], offset: 1 }; // 假设getUsers返回的是数组，我们取第一个元素
      //     newUsers[2] = { items: applicationsRes, offset: 1 }; // 直接使用getApplications的结果
      //     newUsers[3] = { items: usersRes3[1], offset: 1 }; // 假设getUsers返回的是数组，我们取第二个元素
      //
      //     setUsers(newUsers); // 一次性更新users状态
      //     setRefreshing(false); // 只需要调用一次
      //   }).catch(error => {
      //     // 处理可能的错误
      //     console.error("Error in fetching data", error);
      //     setRefreshing(false); // 确保在出错时也停止刷新状态
      //   });
      // }
  }

  /*获取企业成员列表*/
  useLayoutEffect(() => {
    refresh()
  }, [/*userSlice.enterprise.id*/]);

  const handleMemberVisit = (name:string,id:string) => {
    //仅管理员
    if(userSlice.level===3) return;
    navigation.navigate('ColleagueHost',{name,id})
  }

  type ModalType = 'None'|'EditPassword'|'EditNickname'|'EditPhone'|'ToggleEnterPrise'
  // type TitleType = ''|'修改密码'|'修改昵称'|'修改手机'|'切换企业'|'密码错误！'
  const [modalVisible, setModalVisible] = useState<ModalType>('None')
  const [currentModalScreen,setCurrentModalScreen]=useState(0)

  let modalTitle={'EditPassword':'修改密码','EditNickname':'修改昵称','EditPhone':'修改手机','ToggleEnterPrise':'切换企业', 'None': ''}

  const [passwordOld, onChangePasswordOld] = useState("");
  const [passwordNew, onChangePasswordNew] = useState("");
  const [passwordConfirm, onChangePasswordConfirm] = useState("");
  const [nicknameNew, onChangeNicknameNew] = useState(userSlice.nickname);
  const [phoneNew, onChangePhoneNew] = useState(userSlice.phone);
  const [captchaCode,onChangeCaptchaCode] = useState('')

  const [isCounting, setIsCounting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [correctCode,onChangeCorrectCode] = useState<string|null>(null)

  // 当 isCounting 改变时，启动或停止计时器
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;

    if (isCounting) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    // 当 remainingTime 到达 0 时，重置按钮状态
    if (remainingTime === 0) {
      setIsCounting(false);
      setRemainingTime(60);
    }

    // 在组件卸载时清除计时器
    return () => clearInterval(timer);
  }, [isCounting, remainingTime]);

  const phoneNumberPattern = /^1\d{10}$/
  const sendCaptchaCode = () => {
    if (phoneNumberPattern.test(phoneNew)) {
      // 发送验证码
      sendCode(phoneNew).then((res)=>{
        const { code, time } = res as { code: string; time: number };
        onChangeCorrectCode(code);
        setTimeout(()=>{
          onChangeCorrectCode('');
        }, time);
      }).catch()
      setIsCounting(true);
    } else {
      Alert.alert('请输入有效的手机号!');
    }
  }

  const [enterprisesJoined, setEnterprisesJoined] = useState<{items:Enterprise[], offset:number}>({items:[], offset:0})
  const [enterprisesAll, setEnterprisesAll] = useState<{items:Enterprise[], offset:number}>({items:[], offset:0})
  /*获取企业列表*/
  useLayoutEffect(() => {
    if(modalVisible==='ToggleEnterPrise'){
      getEnterprises().then((res)=>{setEnterprisesAll({items:res,offset:0})}).catch()
      getUserEnterprises(userSlice.id).then((res)=>{setEnterprisesJoined({items:res,offset:0})}).catch()
    }
  }, [modalVisible]);


  // const [filteredData, setFilteredData] = useState(enterprises);
  const [searchText, setSearchText] = useState('');
  const [enterpriseViewing, setEnterpriseViewing] = useState<{id:string,name:string,legalName:string,description:string}|null>(null)

  const modalItems= {
    'None': {
      content: [],
      confirm: null,
      // customButton: false,
      // customStack: false,
    },
    /*修改密码*/
    'EditPassword': {
      content: [
        {
          title: "旧密码",
          value: passwordOld,
          onChangeValue: onChangePasswordOld,
          secure: true,
          tip: <Image style={[styles.judge, { opacity: passwordOld ? 1 : 0 }]}
                      source={userSlice.password === passwordOld ? require("../../../../assets/correct.png") : require("../../../../assets/error.png")} />
        }, {
          title: "新密码",
          value: passwordNew,
          onChangeValue: onChangePasswordNew,
          secure: true,
          tip: <View style={[styles.judge]} />
        }, {
          title: "确认密码",
          value: passwordConfirm,
          onChangeValue: onChangePasswordConfirm,
          secure: true,
          tip: <Image style={[styles.judge, { opacity: passwordConfirm ? 1 : 0 }]}
                      source={passwordNew === passwordConfirm ? require("../../../../assets/correct.png") : require("../../../../assets/error.png")} />
        },],
      confirm: async () => {
        if (userSlice.password !== passwordOld) {
          alert('密码错误！')
          return false;
        }
        if (passwordNew !== passwordConfirm) {
          alert('两次输入的密码不一致！！')
          return false;
        }

        try {
          const res = await updatePassword(passwordOld, passwordNew);
          if (res) {
            setUserSlice({ ...userSlice, password: passwordNew });
            saveData('UserSlice', { ...userSlice, password: passwordNew });
            return true;
          } else return false;
        } catch (error) {return false;}

      },
      // customButton: false,
      // customStack: false,
    },
    /*修改昵称*/
    'EditNickname': {
      content: [{
        title: "新昵称",
        value: nicknameNew,
        onChangeValue: onChangeNicknameNew,
        secure: false,
        tip: null,
      }],
      confirm: async () => {
        if (nicknameNew === '') {
          alert('昵称不能为空！');
          return false;
        }

        try {
          const res = await updateNickname(nicknameNew);
          if (res) {
            setUserSlice({ ...userSlice, nickname: nicknameNew });
            saveData('UserSlice', { ...userSlice, username: nicknameNew })
            return true;
          } else return false;
        } catch (error) {
          return false;
        }

      },
      // customButton: false,
      // customStack: false,
    },
    /*修改电话*/
    'EditPhone': {
      content: [{
        title: "新手机",
        value: phoneNew,
        onChangeValue: onChangePhoneNew,
        secure: false,
        tip: null
      },{
      title: "验证码",
        value: captchaCode,
        onChangeValue: onChangeCaptchaCode,
        secure: false,
        tip:  <TouchableOpacity
          activeOpacity={0.5}
          onPress={sendCaptchaCode}
          disabled={isCounting}
          style={{width: 80, borderRadius: 20, borderWidth:1, borderColor: '#A5A5A5', height: 45, padding: 5, justifyContent: 'center', alignItems: 'center', marginLeft: 10}}
        ><Text style={{color: 'grey', fontSize: 12, fontFamily: 'Source Han Sans CN', fontWeight: '400',}}>
          {isCounting ? ` ${remainingTime} 秒` : '发送验证码'}
        </Text></TouchableOpacity>,
      },],
      confirm: async () => {
        //验证码验证
        if (captchaCode !== correctCode/*验证码错误*/) {
          alert('请输入正确的验证码！');
          return false;
        }

        try {
          const res = await updatePhone(phoneNew, captchaCode);
          if (res) {
            setUserSlice({ ...userSlice, phone: phoneNew });
            saveData('UserSlice', { ...userSlice, phone: phoneNew })
            return true;
          } else return false;
        } catch (error) {
          return false;
        }

      },
      // customButton: false,
      // customStack: false,
    },
    /*切换企业*/
    'ToggleEnterPrise': {
      content: enterprisesJoined.items,
      modal: <FlatList style={{width: '100%', height: 180}}
                  nestedScrollEnabled={true}
                  fadingEdgeLength={20}
                  data={enterprisesJoined.items}
                  keyExtractor={(item,index) => index.toString()}
                  renderItem={({ item,index }) => (
                    <TouchableOpacity style={{width: '60%', alignSelf: 'center', paddingVertical:10, marginVertical: 10, backgroundColor: 'white', borderRadius: 28, overflow: 'hidden'}}
                                      onPress={async ()=>{
                                        /*切换企业*/
                                        try {
                                            const {type, users, enterprise} = await changeEnterprise(item.id);
                                            const newUserSlice={...userSlice, level: Number(type), enterprise:enterprise}
                                            setUserSlice(newUserSlice);
                                            saveData('UserSlice', newUserSlice)
                                            refresh()
                                            closeModal()
                                            return true;
                                          } catch (error) {
                                            return false;
                                          }
                                        }
                                      }>
                      <Text style={{textAlign: 'center'}}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  onEndReached={()=>{
                    getUserEnterprises(userSlice.id,enterprisesJoined.offset+1)
                      .then((res) => {
                        setEnterprisesJoined({items:[...enterprisesJoined.items, ...res], offset:enterprisesJoined.offset+1})
                      })
                  }}
        />,
      customButton: {
        textLeft: '申请加入',
        onPressLeft: ()=>{setCurrentModalScreen(1)},
        textRight: '企业注册',
        onPressRight: ()=>{closeModal();navigation.navigate('EnterpriseRegister')},
      },
      next: [
        <View style={{ /*height: 400,*/ padding: 20, justifyContent: 'space-between', marginTop: -20 }}>
          <View style={{width: '100%', flexDirection:'row', alignItems: 'center', marginBottom: 20}}>
            <TouchableOpacity onPress={()=>{setCurrentModalScreen(0);setSearchText('');}}>
              <Image source={require('../../../../assets/back.png')} style={{width: 30, height: 30, marginRight: 10}}/>
            </TouchableOpacity>
            <View style={{flexGrow: 1, height: 40,backgroundColor: 'rgba(255,255,255,0.5)',borderRadius: 28, paddingHorizontal: 10,paddingVertical:0, flexDirection: 'row', alignItems: 'center' }}>
              <TextInput placeholder={"请输入企业名称"}
                         value={searchText}
                         onChangeText={setSearchText}
                // onBlur={handleSearch}
                         style={{flexGrow: 1}}
              />
              <TouchableOpacity
                onPress={()=>{
                  getEnterprises(0,searchText)
                    .then((res)=>{
                      setEnterprisesAll({items:res, offset:0})
                    })
                }}>
                <Image source={require('../../../../assets/search.png')} style={{width: 30, height: 30}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: 250}}>
            <FlatList style={{ width: '100%',/* backgroundColor: 'rgba(255,255,255,0.5)',*/ borderRadius: 28}}
                      nestedScrollEnabled={true}
                      fadingEdgeLength={50}
                      data={enterprisesAll.items}
                      keyExtractor={(item,index) => index.toString()}
                      renderItem={({ item,index }) => (
                        <TouchableOpacity key={index} onPress={()=>{setEnterpriseViewing({id:item.id, name: item.name, legalName:item.legalName, description: item.description});setCurrentModalScreen(2);}} style={{alignSelf: 'center', width:"100%",flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'white', borderRadius: 28, marginVertical: 10, paddingVertical:10}}>
                          <Text>{item.name}</Text>
                          <Text>{item.legalName}</Text>
                        </TouchableOpacity>
                      )}
                      onEndReached={()=>{
                        getEnterprises(enterprisesAll.offset+1,searchText)
                          .then((res) => {
                            setEnterprisesAll({items:[...enterprisesAll.items, ...res], offset:enterprisesAll.offset+1})
                          })
                      }}
            />
          </View>
        </View>
        ,
        <View style={{ /*height: 400,*/ justifyContent: 'space-between', marginTop: -20 }}>
          {enterpriseViewing && <><View style={{backgroundColor: 'rgba(255,255,255,0.3)', margin: 10, padding: 10, borderRadius: 28}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}><Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10}}>{enterpriseViewing?.name}</Text><Text style={{fontSize: 18, marginLeft: 10}}>{enterpriseViewing?.legalName}</Text></View>
            <Text style={{fontSize: 16, marginLeft: 10}}>{enterpriseViewing?.description}</Text>
          </View>
          <View style={{width: '100%', height: 260, maxHeight: 260}}>
            <View style={{/*flexGrow: 1, */ height: 180, backgroundColor: 'rgba(255,255,255,0.3)', margin: 10, padding: 10, borderRadius: 28}}>
              <Text style={{textAlign: 'center'}}>{"备注"}</Text>
              <TextInput multiline={true} style={{}}/>
            </View>
            <View style={{width: '100%'}}>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={()=>{setCurrentModalScreen(1)}} style={[styles.menuButton, { borderRightWidth: 0.5 }]}>
                  <Text style={{ textAlign: "center" }}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{/*提交加入企业申请*/applyEnterprise(enterpriseViewing.id)}} style={[styles.menuButton, { borderLeftWidth: 0.5 }]}>
                  <Text style={{ textAlign: "center" }}>提交申请</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View></>}
        </View>],
      current: currentModalScreen
    }
  }

  const closeModal = () =>{
    setModalVisible('None');
    onChangePasswordOld("");
    onChangePasswordNew("");
    onChangePasswordConfirm("");
    onChangeNicknameNew(userSlice.nickname);
    onChangePhoneNew(userSlice.phone)
    setCurrentModalScreen(0)
    setSearchText('')
    setEnterpriseViewing(null)
  }

  // useEffect(()=>{
  //   saveData('UserSlice',{...userSlice, password: passwordNew})
  // },[userSlice])

  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView style={backgroundStyle}>

      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={backgroundStyle}>
        <View style={[styles.body,]}>
          <Image
            source={require('../../../../assets/logo_transparent.png')} // 指定背景图片的路径
            style={{ height:100, width: 400, alignSelf:'center', top: -15 }}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            fadingEdgeLength={30}
          >
            <View style={{alignItems: 'center', flex: 1}}>
              <View style={{borderRadius: 100, borderWidth: 4, width: 128, height: 128, borderColor: '#B2A8A8', alignSelf: 'center', margin: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                {userSlice.avatar.uri ?
                  <Image source={userSlice.avatar} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                  :
                  <Image source={require('../../../../assets/defaultAvatar.png')} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                }
              </View>
              <Text style={{color: '#63B0CD', fontSize: 31, fontFamily: 'Source Han Sans CN', fontWeight: '700',}}>
                {userSlice.enterprise?userSlice.enterprise.name:"个人"}
              </Text>
              <Text style={{color: '#B2A8A8', fontSize: 16, fontFamily: 'Source Han Sans CN', fontWeight: '400', }}>
                {userSlice.nickname}【{userSlice.level===1?'超级管理员':userSlice.level===2?'管理员':'普通用户'}】
              </Text>
              {/*仅超级管理员*/}
              {userSlice.level===1 && <><View style={{height: 25}}></View>
              <View style={{flexDirection: 'row'}}>
                {tags.map((tag,index)=>
                  <TouchableOpacity style={[{ paddingHorizontal:20, marginHorizontal:10, borderRadius: 13, borderWidth: 1, borderColor: '#B2A8A8'},tag===tags[current]?{backgroundColor: '#A0A0A0'}:{}]}
                                    key={index} onPress={()=>{setCurrent(index)}}>
                    <Text style={[{fontSize: 18, fontFamily: 'Source Han Sans CN', fontWeight: '500', },tag===tags[current]?{color: 'rgba(255, 255, 255, 0.60)'}:{color: '#C2C2C2',}]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                )}
              </View></>}
              {/*————企业成员列表————*/}
              { current===0 &&
                <FlatList
                  nestedScrollEnabled={true}
                  data={enterpriseMembers.items}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity key={index} onPress={() => handleMemberVisit(item.nickname, item.id)} style={{alignSelf: 'center', flexDirection: 'row', width:'100%', height: 70, margin: 10, backgroundColor: 'rgba(245, 245, 245, 0.80)', borderRadius: 28, alignItems: 'center', justifyContent: 'space-between', paddingRight: 40, elevation: 2}}>
                      <View style={{borderRadius: 100, borderWidth: 1, width: 40, height: 40, borderColor: '#B2A8A8', alignSelf: 'center', margin: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                        <Image source={{uri: item.avatar}} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                      </View>
                      <Text style={{textAlign: 'center', color: '#B2A8A8', fontSize: 16, fontFamily: 'Source Han Sans CN', fontWeight: '400'}}>{item.nickname}</Text>
                    </TouchableOpacity>)}
                  keyExtractor={(item, index) => index.toString()}
                  style={{overflow: 'hidden', width: '80%', height: screenHeight - 250, marginVertical: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 27, borderWidth: 2, borderColor: '#C2C2C2'}}
                  showsVerticalScrollIndicator={false}
                  onEndReached={()=>{
                    setRefreshing(true)
                    if(userSlice.enterprise&&!enterpriseMembers.end) {
                      getUsers(userSlice.enterprise.id, enterpriseMembers.offset)
                        .then((res) => {
                          // const newUsers=users;
                          // newUsers[1].items.concat(res[0]);
                          // newUsers[1].offset++;
                          // setUsers(newUsers)
                          setEnterpriseMembers({items:[...enterpriseMembers.items,...res.items], offset:enterpriseMembers.offset+1, end:res.end})
                        })
                        .finally(() => {
                          setRefreshing(false)
                        })
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  onRefresh={()=>{refresh()}}
                  refreshing={refreshing}
                  ListHeaderComponent={<>{userSlice.level === 3 && <Text style={{textAlign: 'center', color: '#BFBFBF', fontSize: 20, fontFamily: 'Source Han Sans CN', fontWeight: '700'}}>企业成员</Text>}</>}
                  ListFooterComponent={<View style={{height: 50}}/>}
                />
              }
              {/*————人员审核列表————*/}
              { current===1 &&
                <FlatList
                  nestedScrollEnabled={true}
                  data={applicants.items}
                  renderItem={({ item, index }) => (
                    item.state==2?
                    <View key={item.id} style={{alignSelf: 'center', flexDirection: 'row', width:'100%', height: 70, margin: 10, backgroundColor: 'rgba(245, 245, 245, 0.80)', borderRadius: 28, alignItems: 'center', justifyContent: 'space-between', paddingRight: 30, elevation: 2}}>
                      <View style={{borderRadius: 100, borderWidth: 1, width: 40, height: 40, borderColor: '#B2A8A8', alignSelf: 'center', margin: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                        <Image source={{uri: item.avatar}} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                      </View>
                      <View style={{flexGrow:1}}><Text style={{textAlign: 'left', color: '#B2A8A8', fontSize: 16, fontFamily: 'Source Han Sans CN', fontWeight: '400'}}>{item.nickname}</Text></View>
                      <TouchableOpacity style={{width: 50, height: 30, marginRight:5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20}}
                                        onPress={()=>{setIsAuthModalVisible(true);setAuthChoice({id:item.id, name:item.nickname, type: 3})}}>
                        <Text style={{color: 'black', fontSize: 16, textAlign: 'center', lineHeight: 30}}>通过</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{width: 60, height: 30, marginLeft:5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20}}
                                        onPress={()=>{
                                          /*TODO:审核不通过*/
                                          authAdmin(userSlice.enterprise?.id as string, item.id, 3, 3)
                                            .then((res)=>{
                                              if(res){
                                                refresh();
                                              }
                                            })
                                            .catch()
                                          // const newApplicants = applicants.items
                                          // newApplicantsItems[index]={...newApplicantsItems[index], state: 3}
                                          // setApplicants({...applicants, items: newApplicantsItems})
                                        }}>
                        <Text style={{color: 'black', fontSize: 16, textAlign: 'center', lineHeight: 30}}>不通过</Text>
                      </TouchableOpacity>
                    </View>
                    :
                    item.state==1||item.state==3?
                      <View key={item.id} style={{alignSelf: 'center', flexDirection: 'row', width:'100%', height: 70, margin: 10, backgroundColor: 'rgba(245, 245, 245, 0.80)', borderRadius: 28, alignItems: 'center', justifyContent: 'space-between', elevation: 2, overflow:'hidden'}}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ width: '120%',overflow: 'hidden', height: 70}} style={{}}>
                          <View
                            style={{width: '83.5%', flexDirection: 'row', alignItems: 'center'}}
                          >
                            <View style={{borderRadius: 100, borderWidth: 1, width: 40, height: 40, borderColor: '#B2A8A8', alignSelf: 'center', margin: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                              <Image source={{uri: item.avatar}} style={{width: '100%', height: '100%'}} resizeMode="cover"/>
                            </View>
                            <View style={{flexGrow:1}}><Text style={{textAlign: 'left', color: '#B2A8A8', fontSize: 16, fontFamily: 'Source Han Sans CN', fontWeight: '400'}}>{item.nickname}</Text></View>
                            <View style={{flexGrow:1, marginRight:40}}><Text style={{textAlign: 'right', color: '#B2A8A8', fontSize: 16, fontFamily: 'Source Han Sans CN', fontWeight: '400'}}>{item.state===3?'已拒绝':'已通过'}</Text></View>
                          </View>
                          <TouchableOpacity style={{width:'16.5%', backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center'}} onPress={()=>{
                            /*TODO:删除记录*/
                            authAdmin(userSlice.enterprise?.id as string, item.id, 3, 4)
                              .then((res)=>{
                                if(res){
                                  refresh();
                                }
                              })
                              .catch()
                          }}>
                            <Text style={{color:'black', fontSize: 18, fontWeight: 'normal'}}>删除</Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    :<></>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={{overflow: 'hidden', width: '80%', height: screenHeight - 250, marginVertical: 20, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 27, borderWidth: 2, borderColor: '#C2C2C2'}}
                  showsVerticalScrollIndicator={false}
                  onEndReached={()=>{
                    setRefreshing(true)
                    if(userSlice.enterprise&&!applicants.end) {
                      if(applicants.state===3)
                        getUsers(userSlice.enterprise.id, applicants.offset, 3)
                          .then((res) => {
                            setApplicants({items:[...applicants.items,...res.items], offset:res.end?0:applicants.offset+1, state: res.end?1:3, end:false})
                            //TODO: 如果未通过(3)人数较少，可以直接请求1
                          })
                          .finally(() => {
                            setRefreshing(false)
                          })
                      else if(applicants.state===1)
                        getUsers(userSlice.enterprise.id, applicants.offset, 1)
                          .then((res) => {
                            setApplicants({items:[...applicants.items,...res.items], offset:applicants.offset+1, state: 1, end:res.end})
                          })
                          .finally(() => {
                            setRefreshing(false)
                          })
                    }
                  }}
                  onEndReachedThreshold={0.5}
                  onRefresh={()=>{refresh()}}
                  refreshing={refreshing}
                  ListHeaderComponent={<>{userSlice.level === 3 && <Text style={{textAlign: 'center', color: '#BFBFBF', fontSize: 20, fontFamily: 'Source Han Sans CN', fontWeight: '700'}}>企业成员</Text>}</>}
                  ListFooterComponent={<View style={{height: 50}}/>}
                />
              }

              <View style={{height: 100}}></View>
            </View>
          </ScrollView>
          {/*————授权窗口————*/}
          <SuperModal isModalVisible={isAuthModalVisible} title={'授权——'+authChoice.name}
                      closeModal={()=>{setIsAuthModalVisible(false);setAuthChoice({...authChoice, type: 3});}}
                      handleConfirm={async ()=>{
                        const res = await authAdmin(userSlice.enterprise?.id as string, authChoice.id, authChoice.type, 3)
                            if(res){
                              refresh();
                              setAuthChoice({...authChoice,type:3});

                              return true;
                            }
                            else return false;
                      }}
                      content={<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height: 180}}>
                        <TouchableOpacity onPress={()=>{setAuthChoice({...authChoice, type: 2})}} style={[{width: 120, height: 50, borderRadius: 20},authChoice.type===2?{backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'black', borderWidth: 1}:{backgroundColor: 'rgba(0,0,0,0.1)'}]}>
                          <Text style={{color: 'black', fontSize: 22, textAlign: 'center', lineHeight: 50}}>管理员</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setAuthChoice({...authChoice, type: 3})}} style={[{width: 120, height: 50, borderRadius: 20},authChoice.type===3?{backgroundColor: 'rgba(0,0,0,0.2)', borderColor: 'black', borderWidth: 1}:{backgroundColor: 'rgba(0,0,0,0.1)'}]}>
                          <Text style={{color: 'black', fontSize: 22, textAlign: 'center', lineHeight: 50}}>普通用户</Text>
                        </TouchableOpacity>
                      </View>}
          />

          {/*————修改窗口————*/}
          <SuperModal isModalVisible={modalVisible!=='None'}
                      // id={modalVisible}
                      title={modalTitle[modalVisible]}
                      closeModal={closeModal}
                      handleConfirm={modalItems[modalVisible].confirm}
                      customButton={modalItems[modalVisible].customButton}
                      current={modalItems[modalVisible].current}
                      next={modalItems[modalVisible].next}
                      content={<>
                        {modalVisible!='None' && ( modalItems[modalVisible].modal ? modalItems[modalVisible].modal
                          : /*其他*/
                          modalItems[modalVisible].content.map((item,index)=>{
                            return <View style={{flexDirection:'row', alignItems: 'center',marginBottom: 20, width: '85%'}} key={index}>
                              <View style={styles.inputContainer}>
                                <Text>{item.title}：</Text>
                                <TextInput
                                  secureTextEntry={item.secure}
                                  style={styles.input_new}
                                  onChangeText={(text)=>item.onChangeValue(text)}
                                  value={item.value}
                                />
                              </View>
                              {item.tip}
                            </View>
                          })
                        )}
                      </>}
                      confirmText={"确认修改"}
          />
            {/*<ModalContent/>*/}
      </View>
      </View>
    </SafeAreaView>
  );
}

