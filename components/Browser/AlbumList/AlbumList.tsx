import React from "react";
import { FlatList } from "react-native";
import AlbumItem from "../AlbumItem/AlbumItem";
import { customAlbum } from "../../../types";
import { useAppSelector } from "../../../hooks/reduxHooks";
import styles from "./styles";

type selectedAlbumType = {
  id: string;
  title: string;
};

type AlbumListProps = {
  albums: customAlbum[];
  setSelectedAlbum: (album: selectedAlbumType) => void;
};

const AlbumList = ({ albums, setSelectedAlbum }: AlbumListProps) => {
    
    const { colors } = useAppSelector((state) => state.theme.theme)
    
    return (
        <FlatList
            style={{ ...styles.albumList, backgroundColor: colors.background2 }}
            contentContainerStyle={styles.contentContainer}
            numColumns={2}
            keyExtractor={(item) => item.id}
            data={albums}
            renderItem={({ item }) => (
                <AlbumItem item={item} setSelectedAlbum={setSelectedAlbum} />
            )}
        />
    );
}

export default AlbumList;