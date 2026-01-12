import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import customeFonts from "../constent/customeFonts";

const SearchBar = ({ placeholder, value, onChangeText }) => {
    return (
        <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#7C7C7C" style={styles.searchIcon} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#7C7C7C"
                style={styles.searchInput}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F3F2",
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: customeFonts.Gilroy_Medium,
        color: "#181725",
    },
});

export default SearchBar;