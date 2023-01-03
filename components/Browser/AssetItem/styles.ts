import { StyleSheet } from "react-native";
import { SIZE } from "../../../utils/Constants";

const ITEM_SIZE = SIZE / 3;

const styles = StyleSheet.create({
assetContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assetImage: {
    width: ITEM_SIZE * 0.95,
    height: ITEM_SIZE * 0.95,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  checkCircleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 24,
    height: 24,
  },
  checkCircleBG: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'gray',
    borderWidth: 1.5,
    borderColor: 'white',
    opacity: 0.9,
  },
})

export default styles;