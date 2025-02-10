import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { addToCart, fetchCart } from "../utils/cartSlice";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleProductClick = () => {
        router.push(`/ProductDetailsScreen?id=${product.id}`);
    };

    return (
        <TouchableOpacity onPress={handleProductClick} style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            <TouchableOpacity style={styles.addButton} onPress={async () => {
                await dispatch(addToCart({ productId: product.id }));
                await dispatch(fetchCart())
            }}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 140,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
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
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 5,
    },
    addButton: {
        marginTop: 5,
        backgroundColor: "green",
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    addButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ProductCard;
