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
  icon: {
    width: 50,
    height: 50,
    padding: 10,
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
    // wordWrap: 'break-word',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  inputContainer: {
    flexShrink: 1,
    height: 50,
    lineHeight: 25,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    //maxWidth: '85%',
    width: '100%',
    backgroundColor: '#F7F6F6',
    borderRadius: 28,
    overflow: 'hidden',
  },
  input_new: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  judge:{
    width: 20,
    height: 20,
    //position:'absolute',
    //right:-20,
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
