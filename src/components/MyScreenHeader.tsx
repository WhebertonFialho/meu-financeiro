import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CaretLeftIcon } from "phosphor-react-native";
import { colors } from "@theme/colors";

type MyScreenHeaderProps = {
  title: string;
  showBackButton?: boolean;
  handleOnPress?: () => void;
};

const MyScreenHeader : React.FC<MyScreenHeaderProps> = (props) => {
  return (
    <View style={styles.container}>
      {props?.showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={props.handleOnPress}
        >
          <CaretLeftIcon color={colors.grayColor} size={32} />
        </TouchableOpacity>
      )}
        <Text style={styles.title}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundColorLight
  },

  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.grayColor,
    textAlign: "center",
  },
});

export default MyScreenHeader;