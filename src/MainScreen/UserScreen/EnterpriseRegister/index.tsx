/*企业注册页面（用户主页——设置菜单——切换企业——企业注册）*/
import {
  Dimensions,
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
import { header } from "../../../Components/Header";
import { launchImageLibrary } from "react-native-image-picker";
import { createEnterprise, uploadImage } from "../../../../module/httpModule/http";
import { Asset } from "react-native-image-picker/lib/typescript/types";


// @ts-ignore
export function EnterpriseRegisterPage({ navigation }) {

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  {/*——————————————————————————————————标头————————————————————————————————————*/}

  const headerTitle = () => <Text style={styles.sectionTitle}>企业注册</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true, });
  }, []);


  const [enterpriseName, onChangeEnterpriseName] = useState("")
  const [creditCode, onChangeCreditCode] = useState("")
  const [ceo, onChangeCEO] = useState("")
  const [describe, onChangeDescribe] = useState("")

  // const [businessLicenseSource, setBusinessLicenseSource] = useState({uri:''})
  // const [identityCardSource, setIdentityCardSource] = useState({uri:''})
  const [businessLicenseImage, setBusinessLicenseImage] = useState<Asset>();
  const [identityCardImage, setIdentityCardImage] = useState<Asset>();

  // const [imgSrc, setImgSrc] = useState( {
  //   '营业执照': {uri:''},
  //   '法人代表身份证': {uri:''},
  // });

  const informations = [
    {
      name: '法人姓名',
      type: 'text',
      value: ceo,
      onChangeValue: onChangeCEO,
    },{
      name: '企业名称',
      type: 'text',
      value: enterpriseName,
      onChangeValue: onChangeEnterpriseName,
    },{
      name: '统一社会信用代码',
      type: 'text',
      value: creditCode,
      onChangeValue: onChangeCreditCode,
    },{
      name: '企业描述',
      type: 'text',
      value: describe,
      onChangeValue: onChangeDescribe,
    },{
      name: '营业执照',
      type: 'picture',
      value: {uri: businessLicenseImage?.uri},
      onChangeValue: setBusinessLicenseImage,
    },{
      name: '法人代表身份证',
      type: 'picture',
      value: {uri: identityCardImage?.uri},
      onChangeValue: setIdentityCardImage,
    },
  ]



  const handleChooseImage = (type) => {
    const options = {
      mediaType: 'photo',
    };

    // 打开相册
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('用户取消了选择图片');
      } else if (response.errorMessage) {
        console.log('选择图片时出现错误:', response.errorMessage);
      } else {
        console.log(response.assets)
        // 选择图片成功，设置头像源
        // @ts-ignore
        informations.find((item)=>item.name===type).onChangeValue(response.assets[0])
        //console.log(source)
        //参考 https://www.npmjs.com/package/react-native-image-picker?activeTab=readme
      }
    });
  };

  const uploadAsset = async (image: Asset) => {
    const response = await fetch(image.uri as string);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, image.fileName);
    return await uploadImage(formData) as string
  }

  const handleApply = async () => {
    if(!enterpriseName) {alert('请填写企业名称'); return}
    if(!creditCode) {alert('请填写统一社会信用代码'); return}
    if(!businessLicenseImage) {alert('请上传营业执照'); return}
    if(!identityCardImage) {alert('请上传法人代表身份证'); return}

    const businessLicenseUrl = await uploadAsset(businessLicenseImage)
    const identityCardUrl = await uploadAsset(identityCardImage)

    /*审核通过才能完成注册*/
    createEnterprise(enterpriseName,creditCode,businessLicenseUrl,identityCardUrl).then((res)=>{if(res) navigation.goBack()/*注册成功后退出页面*/}).catch()

    alert("注册申请已提交！请耐心等待审核！")

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
          style={{ flex: 1}}
        >
          <View style={styles.body}>
            <ScrollView fadingEdgeLength={80} showsVerticalScrollIndicator={false}>
            {informations.map((item,index)=>
            <View style={[{padding: 10, borderColor: 'rgba(255,255,255,0.5)', paddingBottom: 20},index!==informations.length-1?{borderBottomWidth: 1}:{}]}>
              <Text style={{color: '#F5F5F5', fontSize: 21, fontFamily: 'Microsoft Tai Le', fontWeight: '400', margin: 10}}>• {item.name}</Text>
              {item.type==='text'? // @ts-ignore
                <TextInput style={{ alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, width: '90%', height: 30, paddingHorizontal: 10, paddingVertical: 0, color: 'white'}}
                           value={item.value}
                           onChangeText={item.onChangeValue}
                />
                :
                <TouchableOpacity onPress={()=>handleChooseImage(item.name)} style={{ alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, width: '90%', height: 160, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
                {/*TODO: 点击上传图片*/}
                  {item.value.uri ?
                    <Image source={item.value} style={{ /*flex: 1,*/ width: '100%', height: '100%', }} resizeMode='cover' />
                    :
                    <Image source={require('../../../../assets/add_img.png')} style={{width: 40, height: 40,}}/>
                  }
                </TouchableOpacity>
              }
            </View>
            )}

            </ScrollView>
            <View style={{borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.5)'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleApply}
                style={[{ alignSelf:'center',opacity: 0.80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, width: '60%',  alignItems: 'center', padding: 10,margin: 20}]}
              ><Text style={{color: '#C9E1F7', fontSize: 24, fontFamily: 'Microsoft Tai Le', fontWeight: '700',}}>注册</Text></TouchableOpacity>
            </View>
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
  icon: {
    width: 50,
    height: 50
  },
  body: {
    top: 90,
    width: '90%',
    // height: "50%",
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 120,
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
});



