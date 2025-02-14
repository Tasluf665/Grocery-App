import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import CustomeFonts from "../constent/customeFonts";
import Colors from "../constent/Colors";

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: "80%",
    height: 60,
    borderRadius: 15,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.Secondary,
    fontFamily: CustomeFonts.Gilroy_ExtraBold,
  },
});
