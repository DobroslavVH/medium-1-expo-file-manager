import { View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'

import Constants from 'expo-constants'
import { Feather } from '@expo/vector-icons'
import { ImageGallery } from '@georstat/react-native-image-gallery'

import { StackScreenProps } from '@react-navigation/stack'
import { useAppSelector } from '../hooks/reduxHooks'
import { useNavigation } from '@react-navigation/native'

type FileViewParamList = {
    ImageGalleryView: { prevDir: string, folderName: string }
}

type Props = StackScreenProps<FileViewParamList, 'ImageGalleryView'>

const ImageGalleryView = ({ route }: Props) => {

    const [isOpen, setIsOpen] = useState(true)
    const navigation = useNavigation()

    const { images } = useAppSelector((state) => state.images)

    const galleryImageArray = images.map((image) =>
        Object({
            url: image.uri
        })
    )

    const header = () => {
        return (
            <TouchableOpacity
                style={styles.touchable}
                onPress={() => {
                    setIsOpen(false)
                    navigation.goBack()
                }}
            >
                <Feather name='chevron-left' size={36} color='white' />
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <ImageGallery isOpen={isOpen} close={isOpen} images={galleryImageArray} renderHeaderComponent={header} />
        </View>
    )
}

const styles = StyleSheet.create({
    touchable: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(237, 240, 238, 0.3)',
        borderRadius: 10,
        top: Constants.statusBarHeight,
        left: 10,
    }
})

export default ImageGalleryView