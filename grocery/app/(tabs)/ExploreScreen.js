import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { fetchCategories } from "../../utils/fetchProducts"; // Import fetch function


export default function ExploreScreen() {
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    // Fetch categories from Firestore
    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    // Handle Category Click
    const handleCategoryClick = (categoryId) => {
        router.push(`/ProductCategoryScreen?id=${categoryId}`);
    };

    // Render category card
    const renderCategoryCard = ({ item }) => (
        <TouchableOpacity onPress={() => handleCategoryClick(item.id)} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Find Products</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput placeholder="Search Store" style={styles.searchInput} />
            </View>

            {/* Categories Grid using FlatList (Avoid ScrollView) */}
            <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id}
                numColumns={2} // Display as a grid
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    flatListContainer: {
        paddingBottom: 20, // Prevents last item from being cut off
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    searchContainer: {
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 20,
    },
    searchInput: {
        fontSize: 16,
    },
    row: {
        justifyContent: "space-between",
    },
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
    categoryImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
    },
});