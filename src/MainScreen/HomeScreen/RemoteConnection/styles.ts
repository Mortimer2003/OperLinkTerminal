import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerStyle: {
    height: 180,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10
  },
  body: {
    backgroundColor: "#EEEEEF",
    flex: 1,
  },
  icon_large: {
    width: 100,
    height: 100,
  },
  icon: {
    width: 50,
    height: 50,
    padding: 10,
  },
  icon_small: {
    width: 25,
    height: 25,
    margin: 10,
  },
  text1: {
    color: '#484B4B',
    fontSize: 21,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // overflow: "scroll"
    // wordWrap: 'break-word',
  },
  text2: {
    color: '#2EB3E0',
    fontSize: 14,
    fontFamily: 'Microsoft Tai Le',
    fontWeight: '400',
    // wordWrap: 'break-word'
  },
  hostItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    // borderColor: "black",
    //borderWidth: 1,
    //
    marginTop: 15,
    marginBottom: 10,
    padding: 20,

    width: "84%",
    marginLeft: "8%",
    marginRight: "8%",
    height: 94,
    backgroundColor: '#F5F5F5',
    shadowColor: 'rgba(255, 255, 255, 0.50)',
    shadowOffset: {
      width: -6,
      height: -6,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 27,
  },
  add: {
    position: "absolute",
    right: 10,
    bottom: 100,
    //margin: -20,
    borderRadius: 50,
  },

  sectionTitle: {
    // fontSize: 24,
    // fontWeight: "600",
    // mixBlendMode: 'multiply',
    color: '#BFBFBF',
    fontSize: 38,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '700',
    // wordWrap: 'break-word',
    marginLeft: 20,
    letterSpacing: 20,

  },
  setContainer: {
    width: "auto"
  },
  modalContainer: {
    position: 'absolute',
    alignSelf: "flex-end",
    width: "auto",
    height: 'auto',
    maxWidth: 150,
    top: 50,
    margin: 10,
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 26,
    backgroundColor: "rgba(75.64, 75.64, 75.64, 0.50)",
    backdropFilter: 'blur(10px)',
  },
  modalText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
    color: "#F5F5F5",
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    textAlign: 'center'
    // wordWrap: 'break-word',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0)",
  },

  modalTitle: {
    textAlign:'center',
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

