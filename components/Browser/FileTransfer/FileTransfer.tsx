import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";

import Modal from "react-native-modal";
import * as FileSystem from 'expo-file-system'
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppSelector } from "../../../hooks/reduxHooks";
import styles from "./styles";

type FileTransferDialogProps = {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    currentDir: string;
    moveDir: string;
    setMoveDir: any;
    moveSelectedFiles: (destination: string) => void;
    moveOrCopy: string;
    setMoveOrCopy: (value: string) => void;
}

const FileTransferDialog = ({
    isVisible,
    setIsVisible,
    currentDir,
    moveDir,
    setMoveDir,
    moveSelectedFiles,
    moveOrCopy,
    setMoveOrCopy
}: FileTransferDialogProps) => {

    const { colors } = useAppSelector((state) => state.theme.theme)

    const [currentFolders, setCurrentFolders] = useState<string[]>([])
    
    async function getFolders() {
        const folders = await FileSystem.readDirectoryAsync(currentDir + moveDir)
        const folderPromises = folders.map((folder) => FileSystem.getInfoAsync(currentDir + moveDir + `/${folder}`))    
        Promise.all(folderPromises).then((values) => {
            const folderItems = values
                .filter((item) => item.isDirectory)
                .map((item) => {
                    const folderName = item.uri.endsWith('/')
                        ? item.uri
                            .slice(0, item.uri.length - 1)
                            .split('/')
                            .pop()
                        : item.uri.split('/').pop()
                    return folderName
                })
            setCurrentFolders(folderItems)
        })
    }

    useEffect(() => {
        if (isVisible) getFolders()
    }, [isVisible, moveDir])

    const handleModalClose = () => {
        setIsVisible(false)
        setMoveDir('')
        setMoveOrCopy('')
    }

    const NavigateUpFolder = () => {
        const path = currentDir + moveDir
        let pathSplit = path.split('/')
        if (path.endsWith('expo-file-manager/') || path.endsWith('expo-file=manager')) return
        else {
            setMoveDir((prev) => prev.replace('/' + pathSplit[pathSplit.length - 1], ''))
        }
    }

    const RenderItem = ({ item, moveDir, setMoveDir }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() => {
                let pathAppend = moveDir.endsWith('/')
                    ? moveDir + item
                    : moveDir + '/' + item
                setMoveDir(pathAppend)
            }}
        >
            <View style={styles.fileRow}>
                <View style={styles.fileRowLeft}>
                    <Feather name="folder" size={35} color={ colors.primary} />
                </View>
                <View style={styles.fileRowRight}>
                    <Text style={{...styles.fileTitleText, color: colors.primary}}>
                        {decodeURI(item)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={() => handleModalClose()}
            onBackdropPress={() => handleModalClose()}
        >
            <View style={{...styles.modalBody, backgroundColor: colors.background2}}>
                <Text style={{ ...styles.actionTitle, color: colors.primary }}>
                    {`${moveOrCopy} Files`}
                </Text>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.folderUpButton} onPress={NavigateUpFolder}>
                        <Ionicons name="return-up-back" size={32} color={ colors.primary} />
                    </TouchableOpacity>
                    <Text
                        style={{ ...styles.folderName, color: colors.primary }}
                        ellipsizeMode='head'
                        numberOfLines={1}
                    >
                        {moveDir !== '' ? decodeURI(moveDir) : 'Root'}
                    </Text>
                    <TouchableOpacity
                        style={styles.folderUpButton}
                        onPress={() => {
                            moveSelectedFiles(currentDir + moveDir)
                        }}
                    >
                        <Ionicons name='md-checkmark-done-sharp' size={32} color={colors.primary}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={currentFolders}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <RenderItem item={item} moveDir={moveDir} setMoveDir={setMoveDir}/>
                    )}
                />
            </View>
        </Modal>
    )
}

export default FileTransferDialog;