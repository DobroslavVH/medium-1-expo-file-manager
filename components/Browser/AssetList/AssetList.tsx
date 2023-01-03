import React from "react";
import { FlatList } from "react-native";
import AssetItem from "../AssetItem/AssetItem";
import { ExtendedAsset } from "../../../types";
import styles from "./styles";

type AssetListProps = {
    assets: ExtendedAsset;
    albumId: string;
    hasNextPage: boolean;
    endCursor: string;
    isSelecting: boolean;
    getAlbumAssets: (albumId: string, after?: string | undefined) => void;
    toggleSelect: (asset: ExtendedAsset) => void;
}

const AssetList = ({ 
    assets,
    albumId,
    hasNextPage,
    endCursor,
    isSelecting,
    getAlbumAssets,
    toggleSelect
}: AssetListProps) => {
    return (
        <FlatList
            style={styles.albumList}
            contentContainerStyle={styles.contentContainer}
            numColumns={3}
            data={assets}
            renderItem={({ item }) => (
                <AssetItem
                    item={item}
                    toggleSelect={toggleSelect}
                    isSelecting={isSelecting}
                />
            )}
            keyExtractor={(item) => item.albumId}
            onEndReached={() => {
                if (hasNextPage) getAlbumAssets(albumId, endCursor)
            }}
            onEndReachedThreshold={0.9}
        />
    )
}

export default AssetList;