import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const SearchProductCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item.id)} style={styles.card}>
            <Image
                source={{
                    uri: item.image || "https://via.placeholder.com/80", // Fallback to placeholder image
                }}
                style={styles.productImage}
                onError={() => console.warn("Image failed to load:", item.image)} // Log loading errors
            />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
    },
    productPrice: {
        fontSize: 14,
        color: "green",
        fontWeight: "bold",
        marginTop: 5,
    },
});

export default SearchProductCard;
