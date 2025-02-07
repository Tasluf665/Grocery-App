import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router"; // Import for getting query params
import { fetchProductDetails } from "../../utils/fetchProducts";

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
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
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
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
