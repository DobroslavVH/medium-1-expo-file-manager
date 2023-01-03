import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Platform,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../hooks/reduxHooks";
import { IActionSheetProps, IActionListItemProps } from "./types";
import styles from "./styles";


const ActionSheet = ({
  visible,
  onClose,
  actionItems,
  title,
  cancelButtonIndex,
  modalStyle,
  itemStyle,
  itemTextStyle,
  titleStyle,
  itemIcons,
  onItemPressed
}: IActionSheetProps) => {

  const ActionListItem = ({ item, index }: IActionListItemProps) => {
    const { colors } = useAppSelector((state) => state.theme.theme)
    return (
      <TouchableOpacity
        style={[styles.itemStyle, itemStyle]}
        onPress={() => {
          onClose(false)
          if (Platform.OS === 'ios') {
            setTimeout(() => {
              onItemPressed(index)
            }, 1000)
          } else {
            onItemPressed(index)
          }
        }}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={itemIcons[index]}
            size={24}
            color={index === cancelButtonIndex ? '#ff453a' : colors.secondary}
          />
        </View>
        <Text
          style={[
            styles.itemText,
            itemTextStyle,
            cancelButtonIndex && cancelButtonIndex === index && { color: '#ff453a' }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose(false)
      }}
    >
      <TouchableWithoutFeedback onPress={() => {onClose(false)}}>
        <View style={ styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={[styles.modalBody, modalStyle]}>
        {title &&
          (<View style={styles.titleContainer}>
            <Text style={[styles.titleText, titleStyle]}>{ title}</Text>
          </View>)}
        <FlatList
          data={actionItems}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <ActionListItem item={item} index={index}/>
          )}
        />
      </View>
    </Modal>
  );
}

export default ActionSheet