import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import customeFonts from "../constent/customeFonts";
import Colors from "../constent/Colors";

export default function CustomInput({ label, value, onChangeText, placeholder, secureTextEntry, isPassword, editable = true }) {
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isSecure}
                    autoCapitalize="none"
                    keyboardType={label === "Email" ? "email-address" : "default"}
                    editable={editable}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                        <AntDesign name={isSecure ? "eyeo" : "eye"} size={20} color="gray" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontFamily: customeFonts.Lato_Regular
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.inputBorderColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.inputBackgroundColor,
    },
    input: {
        flex: 1,
        height: 50,
    },
});