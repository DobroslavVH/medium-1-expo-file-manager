import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { ExtendedAsset } from "../../../types";
import styles from "./styles";

type AssetProps = {
    item: ExtendedAsset;
    isSelecting: boolean;
    toggleSelect: (asset: ExtendedAsset) => void;
}

const AssetItem = ({
    item: asset,
    isSelecting,
    toggleSelect
}: AssetProps) => {
    return (
        <TouchableOpacity
            key={asset.id}
            style={styles.assetContainer}
            activeOpacity={0.8}
            onLongPress={() => toggleSelect(asset)}
            onPress={() => {
                if (isSelecting) toggleSelect(asset)
            }}
        >
            <Image style={styles.assetImage} source={{uri: asset.uri}} />
            {isSelecting && (
                <View style={styles.checkCircleContainer}>
                    <View style={styles.checkCircleBG}>
                        {asset.selected && (<Ionicons name='checkmark-done' size={20} color='white' />)}
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default AssetItem;