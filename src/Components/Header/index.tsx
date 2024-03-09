// @ts-ignore
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as React from "react";

export const MyHeader = ({ title, leftButton, bottomButton, rightButton, style, }) => (
  <View style={[styles.header, style]}>
    <View style={{ flexDirection: "row", alignItems: 'center' }}>
      <View style={styles.leftButton}>{leftButton}</View>
      <Text style={[styles.headerTitle,rightButton?{left:50}:{textAlign: 'center'}]}>{title}</Text>
      {rightButton && <View style={styles.rightButton}>{rightButton}</View>}
    </View>
    {bottomButton && <View style={styles.bottomButton}>{bottomButton}</View>}
  </View>
);

// @ts-ignore
export const header = ({ navigation, route, options, back }) => {
  const title = options.headerTitle() || route.name;

  return (
    <MyHeader
      title={title}
      leftButton={/*route.name !== "RemoteConnection" ? (*/
        <TouchableOpacity onPress={() => {
          // console.log("back")
          navigation.goBack();
        }} >
          <Image style={styles.icon} source={require("../../../assets/back_light.png")} />
        </TouchableOpacity>
      /*) : undefined*/}
      bottomButton={options.headerRight&&options.bottom?options.headerRight():null}
      rightButton={options.headerRight&&!options.bottom?options.headerRight():null}
      style={options.headerStyle || {backgroundColor: 'rgba(118, 118, 118, 0.80)'}}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    width: '90%',
    height: 'auto',
    minHeight: 46,
    margin: '5%',
    marginBottom: 0,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 1, // Android 阴影效果
    shadowColor: 'rgba(0, 0, 0, 0.25)', // iOS 阴影颜色
    shadowOffset: { width: 0, height: 5 }, // iOS 阴影偏移
    shadowOpacity: 0.25, // iOS 阴影不透明度
    //shadowRadius: 5, // iOS 阴影半径
    borderRadius: 22,
    backdropFilter: 'blur(4px)',
  },
  headerTitle: {
    flex: 1,
    margin: 5,
    // fontSize: 17,
  },
  leftButton: {
    position: "absolute",
    left: 10,
    alignSelf: 'center',
    zIndex: 100,
  },
  bottomButton: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  rightButton: {
    right: 20
  },
  icon: {
    width: 40,
    height: 40
  },
});



