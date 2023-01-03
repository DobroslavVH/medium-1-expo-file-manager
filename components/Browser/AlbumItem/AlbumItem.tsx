import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { customAlbum } from "../../../types";
import { useAppSelector } from "../../../hooks/reduxHooks";
import styles from "./styles";

type selectedAlbumType = {
  id: string;
  title: string;
};

type AlbumProps = {
    item: customAlbum;
    setSelectedAlbum: (album: selectedAlbumType) => void;
};

const AlbumItem = ({item: album, setSelectedAlbum }: AlbumProps) => {

    const { colors } = useAppSelector((state) => state.theme.theme)
    
    return (
        <TouchableOpacity
            style={styles.albumContainer}
            activeOpacity={0.5}
            onPress={() => setSelectedAlbum({id: album.id, title: album.title})}
        >
            <Image style={styles.albumCover} source={{ uri: album.coverImage }} />
            <View style={styles.albumDetailsContainer}>
                <Text style={{...styles.albumTitle, color: colors.primary}} numberOfLines={1}>
                    {album.title}
                </Text>
                <Text style={{...styles.albumTitle, color: colors.primary}}>
                    {album.assetCount}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default AlbumItem;