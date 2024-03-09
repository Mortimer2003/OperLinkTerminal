import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as React from "react";
import { useRef, useState } from "react";

export function SuperInput({bottom,width,buttonColor,handleSend,inputRef}){

  // const aiInputRef = useRef(null);
  const [inputValue, onChangeInputValue] = useState('')
  const [isVoiceBoardOpen, setIsVoiceBoardOpen] = useState(false);
  const [isVoiceInput, setIsVoiceInput] = useState(false);


  const handleToVoice = () => {
    setIsVoiceBoardOpen(!isVoiceBoardOpen);
  };

  const handleVoiceInput = () => {
    setIsVoiceInput(true);
    //TODO: 接收语音输入
    // Voice.start('en-CN')
  };

  const handleVoiceCancel = () => {
    setIsVoiceInput(false);
    // Voice.stop()
  };

  const handleVoiceOK = () => {
    setIsVoiceInput(false);
    //TODO: 处理语音输入
    // Voice.stop()
  };

  return  <>{isVoiceBoardOpen ?
      (isVoiceInput ?
        //语音输入中
        <View style={[styles.voiceInputContainer, {bottom: bottom-10}]}>
          <TouchableOpacity onPress={handleVoiceCancel} ><Image source={require("../../../assets/cancel_voice.png")} style={styles.icon}/></TouchableOpacity>
          <Image source={require("../../../assets/voicing.png")} style={styles.icon_large} />
          <TouchableOpacity onPress={handleVoiceOK} ><Image source={require("../../../assets/ok_voice.png")} style={styles.icon}/></TouchableOpacity>
        </View>
        :
        //语音输入
        <View style={[styles.defaultInputContainer,{bottom: bottom,width:width,}]}>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={handleToVoice}>
              <Image source={require("../../../assets/keyboard.png")} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.input_new} onLongPress={handleVoiceInput} >
              <Text style={{ lineHeight: 36, left: 8, }}>{"长按输入语音"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>{handleSend(inputValue);onChangeInputValue('')}} style={[styles.sendButton,{backgroundColor: buttonColor}]}>
            <Text style={{color: 'white', fontSize: 15, fontFamily: 'Source Han Sans CN', fontWeight: '700',}}>发送</Text>
          </TouchableOpacity>
        </View>
      )
      :
      //文字输入
      <View style={[styles.defaultInputContainer,{bottom: bottom,width:width}]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={handleToVoice}>
            <Image source={require("../../../assets/voice.png")} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
          <TextInput
            style={styles.input_new}
            ref={inputRef}
            onChangeText={onChangeInputValue}
            value={inputValue}
            placeholder={"请输入内容..."}
          />
        </View>
        <TouchableOpacity onPress={()=>{handleSend(inputValue);onChangeInputValue('')}} style={[styles.sendButton,{backgroundColor: buttonColor}]}>
          <Text style={{color: 'white', fontSize: 15, fontFamily: 'Source Han Sans CN', fontWeight: '700',}}>发送</Text>
        </TouchableOpacity>
      </View>
  }</>
}

const styles = StyleSheet.create({
  sendButton: {
    fontSize: 16,
    borderRadius: 20,
    margin: 5,
    paddingHorizontal: 15,

    // backgroundColor: 'rgba(255, 199.77, 138.76, 0.80)',
    height: '100%',
    width: "auto",
    lineHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon_large: {
    width: 50,
    height: 50
  },
  icon: {
    width: 40,
    height: 40
  },
  input_new: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  defaultInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    height: 40,
    flexGrow: 0,
    // width: '80%',
    alignSelf: 'center',
    position: 'absolute',
  },
  voiceInputContainer: {
    alignItems: "center",
    borderRadius: 100,
    marginHorizontal: '5%',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: "rgba(160,160,160,0.8)",

    position: 'absolute',
    width: '90%',
    // bottom: 60,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inputContainer: {
    height: 40,
    lineHeight: 20,

    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    // width: '85%',
    borderRadius: 20,
    overflow: 'hidden',

    flexGrow: 1,
    flexShrink: 1,

    backgroundColor: 'white',
  },

});

