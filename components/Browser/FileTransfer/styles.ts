import { StyleSheet } from "react-native"
import { SIZE } from "../../../utils/Constants"

const styles = StyleSheet.create({
    modalBody: {
        height: SIZE + 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 50,
        width: '100%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    fileRow: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
        width: '100%',
    },
    fileRowLeft: {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '16.666667%',
    },
    fileRowRight: {
        alignItems: 'flex-start',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '83.333333%',
    },
    fileTitleText: {
        fontSize: 13,
        marginBottom: 5,
        fontFamily: 'Poppins_500Medium',
    },
    folderName: {
        width: '60%',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 14,
    },
    folderUpButton: {
        marginLeft: 10,
        width: '15%',
    },
    confirmButton: {
        marginRight: 10,
        width: '15%',
    },
    actionTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        }
})
  
export default styles;