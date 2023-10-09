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
import { saveData, SettingContext } from "../../../../App";
import { header } from "../index";

// @ts-ignore
export function AssistancePage({ navigation }) {

  const { settingSlice, setSettingSlice } = useContext(SettingContext);

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  const headerTitle = () => <Text style={styles.sectionTitle}>帮助</Text>;

  useLayoutEffect(() => {
    navigation.setOptions({ header,headerTitle,headerTransparent:true  });
  }, []);

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

});




