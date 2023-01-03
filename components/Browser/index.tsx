import React, { useState, useEffect } from 'react'
import { View, Text, Alert, Linking, AlertButton, ActivityIndicator, TouchableOpacity, Button } from 'react-native'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'
import useMultiImageSelection from '../../hooks/useMultiImageSelection'
import { ExtendedAsset, customAlbum } from '../../types'
import AlbumList from './AlbumList/AlbumList'
import AssetList from './AssetList/AssetList'
import { useAppSelector } from '../../hooks/reduxHooks'
import styles from './styles'

type PickImagesProps = {
    onMultiSelectSubmit: (data: ExtendedAsset) => void;
    onClose: () => void;
}

type selectedAlbumType = {
    id: string;
    title: string;
}

function PickImages({ onMultiSelectSubmit, onClose }: PickImagesProps) {

    const { colors } = useAppSelector((state) => state.theme.theme)

    const [isMediaGranted, setIsMediaGranted] = useState<boolean | null>(null)

    const [albums, setAlbums] = useState<customAlbum[]>([])

    const [albumsFetched, setAlbumsFetched] = useState(false)

    const [selectedAlbum, setSelectedAlbum] = useState<selectedAlbumType | null>(null)

    const [assets, setAssets] = useState<ExtendedAsset[]>([])

    const [hasNextPage, setHasNextPage] = useState<boolean | null>(null)

    const [endCursor, setEndCursor] = useState<string | null>(null)

    const [selectedAssets, setSelectedAssets] = useState<ExtendedAsset[]>([])

    const isSelecting = useMultiImageSelection(assets)

    console.log('assets', assets)

    async function getAlbums() {
        const albums = await MediaLibrary.getAlbumsAsync()
        const albumsPromiseArray = albums.map(
            async (album) =>
                await MediaLibrary.getAssetsAsync({
                    album: album,
                    first: 10,
                    sortBy: MediaLibrary.SortBy.default
                })
        )
        Promise.all(albumsPromiseArray).then((values) => {
            const nonEmptyAlbums = values
                .filter((item) => item.totalCount > 0)
                .map((item) => {
                    const album = albums.find((a) => a.id === item.assets[0].albumId)
                    const albumObject: customAlbum = {
                        id: album?.id,
                        title: album?.title,
                        assetCount: album?.assetCount,
                        type: album?.type,
                        coverImage: item.assets[0].uri
                    }
                    return albumObject
                })
            setAlbums(nonEmptyAlbums)
            setAlbumsFetched(true)
        })
    }

    async function getItemAssets(albumId: string, after?: string | undefined) {
        const options = {
            album: albumId,
            first: 25,
            sortBy: MediaLibrary.SortBy.creationTime
        }
        if (after) options['after'] = after
        const albumAssets = await MediaLibrary.getAssetsAsync(options)
        setAssets((prev) => [...prev, ...albumAssets.assets])
        setHasNextPage(albumAssets.hasNextPage)
        setEndCursor(albumAssets.endCursor)
    }

    const toggleSelect = (item: ExtendedAsset) => {
        const isSelected = selectedAssets.findIndex((asset) => asset.id === item.id) !== -1
        if (!isSelected) setSelectedAssets((prev) => [...prev, item])
        else {
            setSelectedAssets((prev) => [...prev.filter((asset) => asset.id != item.id)])
            setAssets(assets.map((it) => {
                if (item.id === it.id) {
                    it.selected = !it.selected
                }
                return it
            }))
        }
    }

    const handleInput = () => {
        onClose()
        onMultiSelectSubmit(selectedAssets)
        return selectedAssets
    }

    useEffect(() => {
        const requestMediaPermission = async () => {
            MediaLibrary.requestPermissionsAsync()
                .then((result) => {
                    setIsMediaGranted(result.granted)
                    if (!result.granted || result.accessPrivileges === 'limited') {
                        const alertOptions: AlertButton[] = [
                            {
                                text: 'Go to App Settings',
                                onPress: () => {
                                    Linking.openSettings()
                                }
                            },
                            {
                                text: 'Nevermind',
                                onPress: () => { },
                                style: 'cancel'
                            }
                        ]
                        if (result.canAskAgain && result.accessPrivileges !== 'limited')
                            alertOptions.push({
                                text: 'Try Again',
                                onPress: () => requestMediaPermission()
                            })
                        Alert.alert(
                            'Denied Media Access',
                            'App needs access to all media library',
                            [...alertOptions]
                        )
                    }
                    if (result.granted) getAlbums()
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        requestMediaPermission()
    }, [])

    useEffect(() => {
        if (selectedAlbum) getItemAssets(selectedAlbum.id)
    }, [selectedAlbum])

    if (!isMediaGranted && isMediaGranted !== null) {
        return (
            <View style={{ ...styles.noAccessContainer, backgroundColor: colors.background }}>
                <Text style={{ ...styles.noAccessText, color: colors.primary }}>
                    {'Access is denied'}
                </Text>
                <Button title='Go to settings' onPress={() => Linking.openSettings()} />
            </View>
        );
    }

    if (!albumsFetched) {
        return (
            <View style={{ ...styles.container, backgroundColor: colors.background2 }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    if (albumsFetched && albums.length === 0) {
        return (
            <View style={{ ...styles.container, backgroundColor: colors.background2 }}>
                <Text style={{ color: colors.text, fontFamily: 'Poppins_6005SemiBold' }}>
                    No Albums Found
                </Text>
            </View>
        )
    }

    return (
        <View style={{ ...styles.container, backgroundColor: colors.background2 }}>
            <View style={styles.header}>
                <View style={styles.confirmButton}>
                    {isSelecting && (
                        <TouchableOpacity style={styles.handleImport} onPress={handleInput}>
                            <MaterialCommunityIcons
                                name='file-import-outline'
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 18, color: colors.primary }}>
                                {selectedAssets.length}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={{ ...styles.title, color: colors.primary }}>
                    {selectedAlbum?.title || 'Albums'}
                </Text>
                <View style={styles.backButtonContainer}>
                    {selectedAlbum && (
                        <TouchableOpacity onPress={() => {
                            setSelectedAlbum(null)
                            setAssets([])
                            setSelectedAssets([])
                        }}>
                            <Feather name='chevron-left' size={32} color={colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={styles.listContainer}>
                {albumsFetched && !selectedAlbum && (
                    <AlbumList albums={albums} setSelectedAlbum={setSelectedAlbum} />
                )}
                {selectedAlbum && (
                    <AssetList
                        assets={assets}
                        albumId={selectedAlbum.id}
                        getAlbumAssets={getAlbumAssets}
                        hasNextPage={hasNextPage}
                        endCursor={endCursor}
                        toggleSelect={toggleSelect}
                        isSelecting={isSelecting}
                    />
                )}
            </View>
        </View>
    )
}

export default PickImages;