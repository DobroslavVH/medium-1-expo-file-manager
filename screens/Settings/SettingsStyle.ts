import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { SIZE } from "../../utils/Constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 20,
    },
    section: {
        width: SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    sectionItem: {
        display: 'flex',
        flexDirection: 'row',
        height: 45,
    },
    sectionItemText: {
        fontFamily: 'Poppins_500Medium',
    },
    sectionItemLeft: {
        width: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionItemCenter: {
        width: '60%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    sectionItemRight: {
        width: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default styles
