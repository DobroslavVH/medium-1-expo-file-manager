import React, { useState, useEffect } from 'react'
import { View, FlatList, TouchableOpacity, Platform, Alert, BackHandler, Text } from 'react-native'
import Dialog from 'react-native-dialog'
import { Dialog as GalleryDialog, ProgressDialog } from 'react-native-simple-dialogs'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'

import FileItem from '../../components/Browser/FileItem/FileItem'
import PickImages from '../../components/Browser'
import ActionSheet from '../../components/ActionSheet/ActionSheet'
import NewFolderDialog from '../../components/Browser/NewFolderDialog/NewFolderDialog'
import DownloadDialog from '../../components/Browser/DownloadDialog/DownloadDialog'
import FileTransferDialog from '../../components/Browser/FileTransfer/FileTransfer'

import useSelectionChange from '../../hooks/useSelectionChange'
import allProgress from '../../utils/promiseProgress'

import axios, { AxiosError } from 'axios'
import moment from 'moment'
import Constants from 'expo-constants'

import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import * as MediaLibrary from 'expo-media-library'
import * as mime from 'react-native-mime-types'

import { StackScreenProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { ImagePickerAsset } from 'expo-image-picker/build/ImagePicker.types'
import { ExtendedAsset, fileItem } from '../../types'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { setImages } from '../../features/files/imagesSlice'
import { setSnack, snackActionPayload } from '../../features/files/snackbarSlice'
import { HEIGHT, imageFormats, reExt, SIZE } from '../../utils/Constants'
import styles from './styles'
import { Logs } from 'expo'

Logs.enableExpoCliLogging()

type BrowserParamList = { Browser: { prevDir: string, folderName: string }; }

type IBrowserProps = StackScreenProps<BrowserParamList, 'Browser'>;

const Browser = ({ route }: IBrowserProps) => {
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const { colors } = useAppSelector((state) => state.theme.theme)
    const docDir: string = FileSystem.documentDirectory || ''

    const [currentDir, setCurrentDir] = useState<string>(route?.params?.prevDir !== undefined ? route?.params?.prevDir : docDir)
    const [moveDir, setMoveDir] = useState('')
    const [files, setFiles] = useState<fileItem[]>([])
    const [selectedFiles, setSelectedFiles] = useState<fileItem[]>([])
    const [folderDialogVisible, setFolderDialogVisible] = useState(false)
    const [downloadDialogVisible, setDownloadDialogVisible] = useState(false)
    const [renameDialogVisible, setRenameDialogVisible] = useState(false)
    const [newFileName, setNewFileName] = useState('')
    const [renamingFile, setRenamingFile] = useState<fileItem[]>()
    const [multiImageVisible, setMultiImageVisible] = useState(false)
    const [importProgressVisible, setImportProgressVisible] = useState(false)
    const [destinationDialogVisible, setDestinationDialogVisible] = useState(false)
    const [newFileActionSheet, setNewFileActionSheet] = useState(false)
    const [moveOrCopy, setMoveOrCopy] = useState('')
    console.log('moveOrCopy', moveOrCopy)

    const { multiSelect, allSelected } = useSelectionChange(files)

    useEffect(() => {
        getFiles()
    }, [currentDir])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getFiles()
        })
        return unsubscribe
    }, [navigation])

    useEffect(() => {
        if (route?.params?.folderName !== undefined) {
            setCurrentDir((prev) => prev?.endsWith('/')
                ? prev + route.params.folderName
                : prev + '/' + route.params.folderName
            )
        }
    }, [route])

    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.goBack()
            }
            return true
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => backHandler.remove()
    }, [])

    const renderItem = ({ item }: { item: fileItem }) => (
        <FileItem
            item={item}
            currentDir={currentDir}
            toggleSelect={toggleSelect}
            multiSelect={multiSelect}
            setTransferDialog={setDestinationDialogVisible}
            setMoveOrCopy={setMoveOrCopy}
            deleteSelectedFiles={deleteSelectedFiles}
            setRenamingFile={setRenamingFile}
            setRenameDialogVisible={setRenameDialogVisible}
            setNewFileName={setNewFileName}
        ></FileItem>
    );

    const handleDownload = (downloadUrl: string) => {
        axios
            .get(downloadUrl)
            .then((res) => {
                const fileExist = mime.extension(res.headers['content-type'])
                FileSystem.downloadAsync(
                    downloadUrl,
                    currentDir + '/DL_' + moment().format('DDMMYHmmss') + '.' + fileExist
                )
                    .then(() => {
                        getFiles()
                        setDownloadDialogVisible(false)
                        handleSetSnack({
                            message: 'Download Complete'
                        })
                    })
                    .catch((_) => {
                        handleSetSnack({
                            message: 'Please provide a correct url'
                        })
                    })
            })
            .catch((error: AxiosError) => {
                handleSetSnack({
                    message: error.message
                })
            })
    }

    const toggleSelect = (item: fileItem) => {
        if (item.selected && selectedFiles.includes(item)) {
            const index = selectedFiles.indexOf(item)
            if (index > -1) {
                selectedFiles.splice(index, 1)
            }
        } else if (!item.selected && !selectedFiles.includes(item)) {
            setSelectedFiles((prev) => [...prev, item])
        }
        setFiles(files.map((i) => {
            if (item === i) {
                i.selected = !i.selected
            }
            return i
        }))

    }

    const toggleSelectAll = () => {
        if (!allSelected) {
            setFiles(
                files.map((item) => {
                    item.selected = true
                    return item
                })
            )
            setSelectedFiles(files)
        } else {
            setFiles(
                files.map((item) => {
                    item.selected = false
                    return item
                })
            )
            setSelectedFiles([])
        }
    }

    const getFiles = async () => {
        FileSystem.readDirectoryAsync(currentDir)
            .then((dirFiles) => {
                if (currentDir !== route?.params?.prevDir) {
                    const filteredFiles = dirFiles.filter(
                        (file) => file !== 'RCTAsyncLocalStorage'
                    );
                    const filesProms = filteredFiles.map((fileName) =>
                        FileSystem.getInfoAsync(currentDir + '/' + fileName)
                    );
                    Promise.all(filesProms).then((results) => {
                        let tempfiles: fileItem[] = results.map((file) => {
                            const name = file.uri.endsWith('/')
                                ? file.uri
                                    .slice(0, file.uri.length - 1)
                                    .split('/')
                                    .pop()
                                : file.uri.split('/').pop();
                            return Object({
                                ...file,
                                name,
                                selected: false,
                            });
                        });
                        setFiles(tempfiles);
                        const tempImageFiles = results.filter((file) => {
                            let fileExtension = file.uri
                                .split('/')
                                .pop()
                                .split('.')
                                .pop()
                                .toLowerCase();
                            if (imageFormats.includes(fileExtension)) {
                                return file;
                            }
                        });
                        dispatch(setImages(tempImageFiles));
                    });
                }
            })
            .catch((_) => { });
    };

    async function createDirectory(name: string) {
        FileSystem.makeDirectoryAsync(currentDir + '/' + name)
            .then(() => {
                getFiles()
                setFolderDialogVisible(false)
            })
            .catch(() => {
                handleSetSnack({
                    message: 'Folder could not be created or already exists'
                })
            })
    }

    const pickImage = async () => {

        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== 'granted') {
                    handleSetSnack({
                        message: 'Sorry, we need camera roll permissions'
                    })
                }
                MediaLibrary.requestPermissionsAsync()
            }

        })()

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })

        if (!result.canceled) {

            const uri = result.assets?.[0]?.uri
            const type = result.assets?.[0]?.type
            const fileName: string = uri.replace(/^.*[\\\/]/, '')
            const ext: string | null = reExt.exec(fileName)![1]
            const fileNamePrefix = type === 'image' ? 'IMG_' : 'VID_'
            FileSystem.moveAsync({
                from: uri,
                to: currentDir +
                    '/' +
                    fileNamePrefix +
                    moment().format('DDMMYHmmss') +
                    '.' +
                    ext,
            })
                .then(() => {
                    getFiles()
                })
                .catch((error) => console.log(error))
        }
    }

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: false
        })

        if (result.type === 'success') {
            const { exists: fileExists } = await FileSystem.getInfoAsync(result.uri)
            if (fileExists) {
                Alert.alert(
                    'Conflict',
                    `File with same name already exist ${result.name}`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Replase this file',
                            onPress: () => {
                                FileSystem.copyAsync({
                                    from: result.uri,
                                    to: currentDir + '/' + result.name
                                })
                                    .then((_) => {
                                        getFiles()
                                        handleSetSnack({
                                            message: `${result.name} is copied`
                                        })
                                    })
                                    .catch((_) => {
                                        handleSetSnack({
                                            message: 'Au unexpected error'
                                        })
                                    })
                            },
                            style: 'default'
                        }
                    ]
                )
            }
        }
    }

    const onMultiSelectSubmit = async (data: ExtendedAsset[]) => {
        const transfetPromises = data.map((file) =>
            FileSystem.copyAsync({
                from: file.uri,
                to: currentDir + '/' + file.filename
            })
        )
        Promise.all(transfetPromises).then(() => {
            setMultiImageVisible(false)
            getFiles()
        })
    }

    const moveSelectedFiles = async (destination: string) => {
        const selectedFiles = files.filter((file) => file.selected)
        const destinationFolderFiles = await FileSystem.readDirectoryAsync(destination)
        function executeTransfer() {
            console.log('moveOrCopy', moveOrCopy)
            console.log('destination', destination)
            const transferPromises = selectedFiles.map((file) => {
                if (moveOrCopy === 'Copy') {
                    return FileSystem.copyAsync({
                        from: currentDir + '/' + file.name,
                        to: destination + '/' + file.name
                    })
                } else
                    return FileSystem.moveAsync({
                        from: currentDir + '/' + file.name,
                        to: destination + '/' + file.name
                    })
            })
            allProgress(transferPromises, (p) => { }).then((_) => {
                setDestinationDialogVisible(false)
                setMoveDir('')
                setMoveOrCopy('')
                getFiles()
                navigation.goBack()
            })
        }

        const conflictingFiles = selectedFiles.filter((file) => {
            destinationFolderFiles.includes(file.name)
        })

        const confLen = conflictingFiles.length
        if (confLen > 0) {
            Alert.alert(
                'Conflicting files',
                `the destination folder has ${confLen} ${confLen === 1 ? 'file' : 'files'
                } with the same ${confLen === 1 ? 'name' : 'names'}`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Replace the file',
                        onPress: () => {
                            executeTransfer()
                        },
                        style: 'default'
                    }
                ]
            )
        } else {
            executeTransfer()
        }
    }

    const deleteSelectedFiles = async (file: fileItem) => {
        const filesToBeDeleted = file ? [file] : selectedFiles
        console.log('filesToBeDeleted', filesToBeDeleted)
        const deleteProms = filesToBeDeleted.map((file) => {
            FileSystem.deleteAsync(file.uri)
        })
        Promise.all(deleteProms)
            .then((_) => {
                handleSetSnack({
                    message: 'Files deleted'
                })
                getFiles()
                setSelectedFiles([])
            })
            .catch((error) => {
                console.log(error)
                getFiles()
            })
    }

    const onRename = async () => {
        console.log('renamingFile', renamingFile)
        const filePathSplit = renamingFile.uri.split('/')
        console.log('filePathSplit', filePathSplit)
        const fileFolderPath = filePathSplit
            .slice(0, filePathSplit.length - 1)
            .join('/')
        console.log('fileFolderPath', fileFolderPath)
        FileSystem.getInfoAsync(fileFolderPath + '/' + newFileName).then((res) => {
            if (res.exists) {
                handleSetSnack({
                    message: 'File or folder with same name already exist'
                })
            } else {
                FileSystem.moveAsync({
                    from: renamingFile.uri,
                    to: fileFolderPath + '/' + newFileName
                })
                    .then(() => {
                        setRenameDialogVisible(false)
                        getFiles()
                    })
                    .catch((_) => {
                        handleSetSnack({
                            message: 'Error with renaming your file or folder'
                        })
                    })
            }
        })
    }

    const handleSetSnack = (data: snackActionPayload) => {
        dispatch(setSnack(data))
    }

    return (
        <View style={{ ...styles.container, backgroundColor: colors.background }}>
            <ActionSheet
                title='Add new file'
                visible={newFileActionSheet}
                actionItems={[
                    'Camera roll',
                    'Multi image picker',
                    'Import file from storage',
                    'Download',
                    'Cancel'
                ]}
                itemIcons={[
                    'camera',
                    'image',
                    'drive-file-move-outline',
                    'file-download',
                    'close'
                ]}
                onClose={setNewFileActionSheet}
                onItemPressed={(buttonIndex) => {
                    if (buttonIndex === 0) {
                        pickImage()
                    } else if (buttonIndex === 1) {
                        setMultiImageVisible(true)
                    } else if (buttonIndex === 2) {
                        pickDocument()
                    } else if (buttonIndex === 3) {
                        setDownloadDialogVisible(true)
                    }
                }}
                cancelButtonIndex={4}
                modalStyle={{ backgroundColor: colors.background2 }}
                itemTextStyle={{ color: colors.text }}
                titleStyle={{ color: colors.secondary }}
            />
            <FileTransferDialog
                isVisible={destinationDialogVisible}
                setIsVisible={setDestinationDialogVisible}
                currentDir={docDir}
                moveDir={moveDir}
                setMoveDir={setMoveDir}
                moveSelectedFiles={moveSelectedFiles}
                moveOrCopy={moveOrCopy}
                setMoveOrCopy={setMoveOrCopy}
            />
            <NewFolderDialog
                visible={folderDialogVisible}
                createDirectory={createDirectory}
                setFolderDialogVisible={setFolderDialogVisible}
            />
            <DownloadDialog
                visible={downloadDialogVisible}
                handleDownload={handleDownload}
                setDownloadDialog={setDownloadDialogVisible}
            />
            <Dialog.Container visible={renameDialogVisible}>
                <Dialog.Title>Rename {decodeURI(renamingFile?.name)}</Dialog.Title>
                <Dialog.Input
                    value={decodeURI(newFileName)}
                    onChangeText={(text) => setNewFileName(text)}
                ></Dialog.Input>
                <Dialog.Button
                    label="Cancel"
                    onPress={() => {
                        setRenameDialogVisible(false);
                    }}
                />
                <Dialog.Button label="OK" onPress={() => onRename()} />
            </Dialog.Container>
            <GalleryDialog
                dialogStyle={{
                    backgroundColor: colors.background2,
                }}
                animationType="slide"
                contentStyle={styles.contentStyle}
                overlayStyle={styles.overlayStyle}
                visible={multiImageVisible}
                onTouchOutside={() => setMultiImageVisible(false)}
            >
                <PickImages
                    onMultiSelectSubmit={onMultiSelectSubmit}
                    onClose={() => setMultiImageVisible(false)}
                />
            </GalleryDialog>
            <ProgressDialog
                visible={importProgressVisible}
                title="Importing Assets"
                message="Please, wait..."
            />
            <View style={styles.topButtons}>
                <View style={styles.topLeft}>
                    <TouchableOpacity onPress={() => setNewFileActionSheet(true)}>
                        <AntDesign name='addfile' size={30} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFolderDialogVisible(true)}>
                        <Feather name='folder-plus' size={30} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                {multiSelect && (
                    <View style={styles.topRight}>
                        <TouchableOpacity
                            onPress={() => {
                                setDestinationDialogVisible(true)
                                setMoveOrCopy('Move')
                            }}
                        >
                            <MaterialCommunityIcons name='file-move-outline' size={30} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleSelectAll}>
                            <Feather style={{ marginLeft: 10 }} name={allSelected ? 'check-square' : 'square'} size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={{ ...styles.fileList, borderTopColor: colors.primary }}>
                <Text></Text>
                <FlatList
                    data={files}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={_keyExtractor}
                />
            </View>
            {multiSelect && (
                <View style={{ ...styles.bottomMenu, backgroundColor: colors.background }}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                            name='export-variant'
                            size={28}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const _keyExtractor = (item: fileItem) => item.name

export default Browser