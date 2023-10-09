import { useContext } from "react";
import { defaultUserSlice } from "../../../module/dataSlice";
import { Text, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { saveData, UserContext } from "../../../App";

export const UserScreen = () => {
  const { userSlice, setUserSlice } = useContext(UserContext);

  const handleLogout=()=>{
    setUserSlice(defaultUserSlice);
    saveData('UserSlice',defaultUserSlice)
  }

  console.log(userSlice.isLogin)

  return (
    <View>
      <Text>User</Text>
      <View>
        {Object.entries(userSlice).map(([key,value],index)=>
          <Text key={index}>{key}: {value.toString()}</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleLogout}><Text>退出登录</Text></TouchableOpacity>
    </View>
  );
};
