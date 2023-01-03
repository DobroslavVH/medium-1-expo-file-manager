import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    setTarget: {
        position: 'absolute',
        right: 10,
        borderRadius: 5,
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    searchBar: {
        flex: 0.1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarInput: {
        height: 40,
        borderWidth: 0.5,
        marginTop: 5,
        marginHorizontal: 10,
        padding: 5,
        paddingRight: 45,
        borderRadius: 5,
        width: '95%',
        overflow: 'hidden',
    },
    bottomBar: {
        width: '100%',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    progressBar: {
        height: 2,
        marginBottom: 2,
    },
})

export default styles