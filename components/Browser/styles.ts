import { SIZE } from "../../utils/Constants";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZE,
        marginBottom: 15,
    },
    backButtonContainer: {
        position: 'absolute',
        right: 10,
    },
    confirmButton: {
        position: 'absolute',
        left: 10,
    },
    listContainer: {
        width: SIZE,
        height: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noAccessContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
    },
    noAccessText: {
        marginBottom: 20,
        fontFamily: 'Poppins_500Medium',
    },
    handleImport: {
        display: 'flex',
        flexDirection: 'row',
        width: 60,
        height: 30,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    }
})

export default styles;