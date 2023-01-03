import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { SIZE } from "../utils/Constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 20,
        padding: 10,
    },
    section: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        width: SIZE,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    rowLeft: {
        width: '30%',
        height: 40,
        padding: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    rowRight: {
        width: '70%',
        height: 40,
        padding: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    roomInput: {
        height: 40,
        width: SIZE * 0.65,
        borderBottomWidth: 0.5,
        padding: 5,
    },
    roomIDContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    scanIcon: {
        position: 'absolute',
        right: 20,
    },
})

export default styles