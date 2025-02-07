import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { getSpecialSectionProducts } from "../../utils/fetchProducts"; // Import function

export default function ShopScreen() {
    const [exclusiveProducts, setExclusiveProducts] = useState([]);
    console.log(exclusiveProducts);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    useEffect(() => {
        // Fetch Exclusive Offers
        getSpecialSectionProducts("exclusive_offer").then(setExclusiveProducts);

        // Fetch Best Selling
        getSpecialSectionProducts("best_selling").then(setBestSellingProducts);
    }, []);

    // Handle Product Click
    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    // Render a single product card
    const renderProductCard = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductClick(item.id)} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Exclusive Offer Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Exclusive Offer</Text>
                <FlatList
                    data={exclusiveProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Best Selling Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Best Selling</Text>
                <FlatList
                    data={bestSellingProducts}
                    renderItem={renderProductCard}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
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
})