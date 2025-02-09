import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchProductDetails } from "../../utils/fetchProducts";
import { AntDesign } from "@expo/vector-icons"; // 🔹 Import favorite icon
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../utils/favoritesSlice";

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.favorites);

    useEffect(() => {
        if (id) {
            fetchProductDetails(id).then((data) => {
                setProduct(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!product) {
        return <Text style={styles.errorText}>Product not found.</Text>;
    }

    const isFavorite = favorites.some((fav) => fav.id === product.id);

    const toggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(product.id));
        } else {
            dispatch(addFavorite(product.id));
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.headerRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <TouchableOpacity onPress={toggleFavorite}>
                    <AntDesign name={isFavorite ? "heart" : "hearto"} size={24} color={isFavorite ? "red" : "black"} />
                </TouchableOpacity>
            </View>
            <Text style={styles.productPrice}>${product.price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    productImage: {
        width: "100%",
        height: 250,
        resizeMode: "contain",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        flex: 1, // 🔹 Makes text take up available space
    },
    productPrice: {
        fontSize: 20,
        color: "green",
        marginTop: 5,
    },
    productDescription: {
        fontSize: 16,
        color: "#555",
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
