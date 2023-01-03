import { StyleSheet } from "react-native";
import { SIZE } from "../../utils/Constants";

const styles = StyleSheet.create({
modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBody: {
    width: SIZE,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    padding: 5,
  },
  titleContainer: {
    width: SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins_500Medium',
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  itemStyle: {
    width: SIZE,
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  itemText: {
    fontFamily: 'Poppins_400Regular',
    color: 'gray',
    fontSize: 15,
  },
  iconContainer: {
    marginLeft: 5,
    marginRight: 10,
  }
})

export default styles