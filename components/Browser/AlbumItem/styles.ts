import { StyleSheet, Dimensions } from "react-native";

const { width: SIZE } = Dimensions.get('window');
const ITEM_SIZE = SIZE / 2;

const styles = StyleSheet.create({
  albumContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  albumCover: {
    width: ITEM_SIZE * 0.9,
    height: ITEM_SIZE * 0.9,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  albumTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  albumDetailsContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    width: ITEM_SIZE,
    height: ITEM_SIZE * 0.3,
  },
});

export default styles;
