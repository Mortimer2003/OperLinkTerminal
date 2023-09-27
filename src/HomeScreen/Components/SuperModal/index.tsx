import { Modal, NativeSyntheticEvent, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as React from "react";

const SuperModal = ({ isModalVisible, closeModal, handleConfirm, text, Content, confirmText }:{ isModalVisible:boolean, closeModal:() => void, handleConfirm:() => boolean, text:string, Content:any, confirmText:string }) => {


  return <Modal
    transparent={true}
    visible={isModalVisible}
    onRequestClose={closeModal}
  >
    <View style={styles.overlay_popModal}>
      <View style={styles.popModal}>
        <Text style={styles.modalTitle}>{text}</Text>
        {Content}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={closeModal} style={[styles.menuButton,{borderRightWidth: 0.5}]}>
            <Text style={{textAlign: 'center'}}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{handleConfirm() && closeModal()}} style={[styles.menuButton,{borderLeftWidth: 0.5}]}>
            <Text style={{textAlign: 'center'}}>{confirmText}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  </Modal>
}

export default SuperModal;

const styles = StyleSheet.create({
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  overlay_popModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200,
  },
  popModal: {
    width: '80%',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#ECECEC',
    // boxShadow: '0px 0px 30px #DADADA',
    borderRadius: 34,
    elevation: 1,
  },
  inputContainer: {
    height: 50,
    lineHeight: 25,
    //flex:1,
    // borderWidth: 1,

    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#F7F6F6',
    borderRadius: 28,
    overflow: 'hidden',
  },
  input_new: {
    flexGrow: 1,
    overflow: 'hidden',
    //backgroundColor: 'pink',
  },
  buttonsContainer: {
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)'
  },
  menuButton: {
    flex: 1,
    //marginTop: 10,
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    borderColor: 'rgba(0,0,0,0.3)'
  },
});
