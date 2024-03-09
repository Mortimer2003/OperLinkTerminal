import {
  Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, TextInput,
  useColorScheme,
  Dimensions, Modal, FlatList, ImageBackground, Easing, Animated, Keyboard, LayoutAnimation
} from "react-native";
import * as React from "react";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { header } from "../../../Components/Header";
import { HostContext, saveData } from "../../../../App";
import { EditHost } from "../../../Components/EditHost";

// @ts-ignore
export function EditHostPage({ route, navigation }) {
  const selected = route.params;
  return <EditHost navigation={navigation} target={selected}/>
}
