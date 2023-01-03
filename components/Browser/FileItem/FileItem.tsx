import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import { useAppSelector } from "../../../hooks/reduxHooks";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Sharing from 'expo-sharing';
import * as Mime from 'react-native-mime-types';
import moment from "moment";

import humanFileSize from "../../../utils/Filesize";
import ActionSheet from "../../ActionSheet/ActionSheet";

import { fileItem } from "../../../types";
import { fileIcons } from "../../../utils/Constants";

import styles from "./styles";

type Props = {
    item: fileItem;
    currentDir: string;
    multiSelect: boolean;
    toggleSelect: (arg0: fileItem) => void;
    setTransferDialog: (arg0: boolean) => void;
    setMoveOrCopy: (arg0: string) => void;
    deleteSelectedFiles: (arg0?: fileItem) => void;
    setRenamingFile: (arg0: fileItem) => void;
    setRenameDialogVisible: (arg0: boolean) => void;
    setNewFileName: (arg0: string) => void;
};

export default function FileItem({
    item,
    currentDir,
    multiSelect,
    toggleSelect,
    setTransferDialog,
    setMoveOrCopy,
    deleteSelectedFiles,
    setRenamingFile,
    setRenameDialogVisible,
    setNewFileName
}: Props) {

    const colors = useAppSelector((state) => state.theme.theme)

    const navigation = useNavigation<StackNavigationProp<any>>();

    const [itemActionsOpen, setItemActionsOpen] = useState(false)

    const docDir = currentDir

    const itemMime = Mime.lookup(item.uri) || ' '

    const itemType: string = item.isDirectory ? 'dir' : itemMime.split('/')[0];

    const itemFormat: string = item.isDirectory ? 'dir' : itemMime.split('/')[1];

    // helper functions
    const ThumbImage = ({ uri }: { uri: string }) => {
        return (
            <Image
                style={styles.image}
                source={{ uri }}
            />
        )
    }

    const ItemThumb = () => {
        switch (itemType) {
            case 'dir':
                return <Feather name="folder" size={35} color={colors.colors.primary} />
            case 'image':
            case 'video':
                return <ThumbImage uri={item.uri} />
            case 'audio':
                return <FontAwesome5 name="file-audio" size={35} color={colors.colors.primary} />
            case 'font':
                return <FontAwesome5 name="font" size={35} color={colors.colors.primary} />
            case 'application':
                return <MaterialCommunityIcons name={fileIcons[itemFormat] || 'file-outline'} size={35} color={colors.colors.primary} />
            case 'text':
                return <MaterialCommunityIcons name={fileIcons[itemFormat] || 'file-outline'} size={35} color={colors.colors.primary} />
            default:
                return <Feather name="file" size={35} color={colors.colors.primary} />
        };
    }

    const onPress = () => {
        if (!multiSelect) {
            if (item.isDirectory) {
                navigation.push('Browser', {
                    folderName: item.name,
                    prevDir: docDir
                })
            } else if (itemType === 'image') {
                navigation.push('ImageGalleryView', {
                    folderName: item.name,
                    prevDir: docDir
                })
            } else {
                navigation.push('MiscFileView', {
                    folderName: item.name,
                    prevDir: docDir
                })
            }
        } else {
            toggleSelect(item)
        }
    }

    const onItemPress = ({ buttonIndex }) => {
        console.log(buttonIndex)
        if (buttonIndex === 4) {
            console.log('delete action')
            setTimeout(() => {
                Alert.alert(
                    'Confirm',
                    `Do you want to delete ${multiSelect ? 'selected items' : ' this item'}?`,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel'
                        },
                        {
                            text: 'Delete',
                            onPress: () => {
                                if (!multiSelect) deleteSelectedFiles(item)
                                else deleteSelectedFiles()
                            }
                        }
                    ]
                )
            }, 300)
        } else if (buttonIndex === 3) {
            Sharing.isAvailableAsync().then((canShare) => {
                if (canShare) {
                    Sharing.shareAsync(docDir + '/' + item.name)
                }
            })
        } else if (buttonIndex === 2) {
            setMoveOrCopy('Copy')
            if (!multiSelect) {
                toggleSelect(item)
                setTransferDialog(true)
            }
        } else if (buttonIndex === 1) {
            setMoveOrCopy('Move')
            if (!multiSelect) {
                toggleSelect(item)
                setTransferDialog(true)
            }
        } else if (buttonIndex === 0) {
            setRenamingFile(item)
            setRenameDialogVisible(true)
            setNewFileName(item.name)
        }
    }

    return (
        <View style={styles.container}>
            <ActionSheet
                title={multiSelect ? "Choose an action" : decodeURI(item.name)}
                visible={itemActionsOpen}
                actionItems={['Rename', 'Move', 'Copy', 'Share', 'Delete', 'Cancel']}
                itemIcons={['edit', 'drive-file-move', 'file-copy', 'share', 'delete', 'close',]}
                onClose={setItemActionsOpen}
                onItemPressed={(buttonIndex) => {
                    if (buttonIndex === 4) {
                        console.log('delete action')
                        setTimeout(() => {
                            Alert.alert(
                                'Confirm',
                                `Do you want to delete ${multiSelect ? 'selected items' : ' this item'}?`,
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => { },
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Delete',
                                        onPress: () => {
                                            if (!multiSelect) deleteSelectedFiles(item)
                                            else deleteSelectedFiles()
                                        }
                                    }
                                ]
                            )
                        }, 300)
                    } else if (buttonIndex === 3) {
                        Sharing.isAvailableAsync().then((canShare) => {
                            if (canShare) {
                                Sharing.shareAsync(docDir + '/' + item.name)
                            }
                        })
                    } else if (buttonIndex === 2) {
                        setMoveOrCopy('Copy')
                        if (!multiSelect) {
                            toggleSelect(item)
                            setTransferDialog(true)
                        }
                    } else if (buttonIndex === 1) {
                        setMoveOrCopy('Move')
                        if (!multiSelect) {
                            toggleSelect(item)
                            setTransferDialog(true)
                        }
                    } else if (buttonIndex === 0) {
                        setRenamingFile(item)
                        setRenameDialogVisible(true)
                        setNewFileName(item.name)
                    }
                }}
                cancelButtonIndex={5}
                modalStyle={{ backgroundColor: colors.colors.background2 }}
                itemTextStyle={{ color: colors.colors.text }}
                titleStyle={{ color: colors.colors.secondary }}
            />
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={styles.itemLeft}
                    activeOpacity={0.5}
                    onPress={onPress}
                    onLongPress={() => {
                        if (!multiSelect) toggleSelect(item)
                    }}
                >
                    <View style={styles.itemThumbnail}>
                        {itemType && <ItemThumb />}
                    </View>
                    <View style={styles.itemDetails}>
                        <Text numberOfLines={1} style={{ ...styles.fileName, color: colors.colors.primary }}>
                            {decodeURI(item.name)}
                        </Text>
                        <Text style={{ ...styles.fileDetailText, color: colors.colors.secondary }}>
                            {humanFileSize(item.size)}
                        </Text>
                        <Text style={{ ...styles.fileDetailText, color: colors.colors.secondary }}>
                            {moment(item.modificationTime * 1000).fromNow()}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ ...styles.itemActionButton, backgroundColor: colors.colors.background }}>
                    <TouchableOpacity onPress={() => setItemActionsOpen(true)}>
                        <View style={styles.fileMenu}>
                            {!item.selected
                                ? (<Feather name="more-horizontal" size={24} color={colors.colors.primary} />)
                                : (<Feather name="check-square" size={24} color={colors.colors.primary} />)
                            }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}