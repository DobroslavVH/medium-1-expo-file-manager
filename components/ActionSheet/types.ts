import { MaterialIcons } from "@expo/vector-icons";
import { ViewStyle, TextStyle } from "react-native";

export type IActionSheetProps = {
  visible: boolean;
  onClose: (arg0: boolean) => void;
  actionItems: string[];
  title?: string;
  cancelButtonIndex?: number;
  modalStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  titleStyle?: TextStyle;
  itemIcons: React.ComponentProps<typeof MaterialIcons>['name'][];
  onItemPressed: (arg0: number) => void;
};

export type IActionListItemProps = {
    item: string;
    index: number;
};  
