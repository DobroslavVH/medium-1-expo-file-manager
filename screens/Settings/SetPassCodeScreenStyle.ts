import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { SIZE } from "../../utils/Constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 20,
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 22,
    },
    setupContainer: {
        width: SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    digitsContainer: {
        width: '100%',
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    digitRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    digitItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZE / 6,
        height: SIZE / 6,
    },
    digitNumber: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: SIZE / 6 * 0.5,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 15,
    },
    pinDotsContainer: {
        width: SIZE,
        height: 25,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default styles