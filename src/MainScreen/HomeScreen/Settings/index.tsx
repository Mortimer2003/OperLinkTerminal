import {
  Image, ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import * as React from "react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { header } from "../index";
import { SettingContext, saveData } from "../../../../App";

// @ts-ignore
export function SettingsPage({ navigation }) {

  const { settingSlice, setSettingSlice } = useContext(SettingContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>设置</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true  });
  }, []);

  const [recordKey_connect, setRecordKey_connect] = useState(settingSlice.recordKey_connect);
  const [keepConnect_connect, setKeepConnect_connect] = useState(settingSlice.keepConnect_connect);
  const [functionKey_keyboard, setFunctionKey_keyboard] = useState(settingSlice.functionKey_keyboard);

  const handleSet_connect_recordKey = () => {
    setRecordKey_connect(!recordKey_connect);
  };

  const handleSet_connect_keepConnect = () => {
    setKeepConnect_connect(!keepConnect_connect);
  };

  const handleSet_keyboard_functionKey = () => {
    setFunctionKey_keyboard(!functionKey_keyboard);
  };

  useEffect(() => {
    //在返回时一次更新设置
    return navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of going back
      e.preventDefault();
      // Call your function before navigating back
      setSettingSlice({recordKey_connect,keepConnect_connect,functionKey_keyboard})
      saveData('SettingSlice',{recordKey_connect,keepConnect_connect,functionKey_keyboard})
      console.log(settingSlice)
      // Actually navigate back
      navigation.dispatch(e.data.action);
    });
  }, [navigation,recordKey_connect,keepConnect_connect,functionKey_keyboard]);

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
        <ScrollView style={styles.body}>

          <View style={styles.column}>
            <Text style={styles.title1}>连接</Text>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.item}
            >
              <Text style={[styles.title2]}>在内存中记录密钥</Text>
              <TouchableOpacity activeOpacity={0.9} style={styles.switchContainer}
                                onPress={handleSet_connect_recordKey}>
                <Image style={[styles.icon, { marginRight: 5 }]}
                       source={recordKey_connect ? require("../../../../assets/switch_on.png") : require("../../../../assets/switch_off.png")}></Image>
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.item}
            >
              <Text style={[styles.title2]}>保持连接</Text>
              <TouchableOpacity activeOpacity={0.9} style={styles.switchContainer}
                                onPress={handleSet_connect_keepConnect}>
                <Image style={[styles.icon, { marginRight: 5 }]}
                       source={keepConnect_connect ? require("../../../../assets/switch_on.png") : require("../../../../assets/switch_off.png")}></Image>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.title1}>键盘</Text>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.item}
            >
              <Text style={[styles.title2]}>Ctrl+num(数字键)作为功能键</Text>
              <TouchableOpacity activeOpacity={0.9} style={styles.switchContainer}
                                onPress={handleSet_keyboard_functionKey}>
                <Image style={[styles.icon, { marginRight: 5 }]}
                       source={functionKey_keyboard ? require("../../../../assets/switch_on.png") : require("../../../../assets/switch_off.png")}></Image>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>


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
    // Android 阴影样式
    elevation: 1, // 适用于 Android
    // iOS 阴影样式
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    width: 50,
    height: 50
  },
  column:{
    padding: 15,
    paddingLeft: 25,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.30)",
  },
  item: {
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title1: {
    color: '#F5F5F5',
    fontSize: 27,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '700',
  },
  title2: {
    color: '#F5F5F5',
    fontSize: 17,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
  },
  switchContainer: {
    width: "auto",
    position: "absolute",
    right: 0,
    display: "flex",
    fontSize: 20
  }

});




