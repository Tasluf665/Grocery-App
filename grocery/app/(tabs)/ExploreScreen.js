import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../utils/categoriesSlice"; // Import Redux action
import { searchProducts } from "../../utils/searchSlice"; // Import Redux search action
import { debounce } from "lodash";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import SearchProductCard from "../../component/SearchProductCard";

export default function ExploreScreen() {
    const dispatch = useDispatch();
    const router = useRouter();

    // 🔹 Get categories & loading state from Redux store
    const { categories, loading } = useSelector((state) => state.categories);

    // 🔹 Get search results from Redux store
    const { results: searchResults, loading: searchLoading } = useSelector((state) => state.search);

    const [searchQuery, setSearchQuery] = useState("");

    // Fetch categories from Redux store on mount
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // Debounced Search Function (Only API Call)
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length >= 0) {
                dispatch(searchProducts(query)); // 🔹 Dispatch Redux search action
            }
        }, 500),
        [dispatch]
    );

    // Handle Search Input (Instant UI Update)
    const handleSearchInput = (query) => {
        setSearchQuery(query); // 🔹 Update UI immediately
        debouncedSearch(query); // 🔹 Trigger Redux search after debounce
    };

    // Handle Category Click
    const handleCategoryClick = (categoryId) => {
        router.push(`/ProductCategoryScreen?id=${categoryId}&type=categories`);
    };

    // Handle Product Click
    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    // Render category card
    const renderCategoryCard = ({ item }) => (
        <TouchableOpacity onPress={() => handleCategoryClick(item.id)} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderProductCard = ({ item }) => (
        <SearchProductCard item={item} onPress={handleProductClick} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Find Products</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search Categories"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchInput} // 🔹 Calls function that updates instantly
                />
            </View>

            {/* Show Loading Indicator */}
            {loading && <LoadingActivityIndicator />}
            {searchLoading && <LoadingActivityIndicator />}

            {/* Categories Grid using FlatList */}
            <FlatList
                key={searchResults.length > 0 ? "searchGrid" : "categoriesList"} // 🔹 Force re-render when switching
                data={searchResults.length > 0 ? searchResults : categories}
                renderItem={searchResults.length > 0 ? renderProductCard : renderCategoryCard}
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
    productImage: {
        width: 80,
        height: 80,
        resizeMode: "contain", // Ensures the image fits inside the frame
        borderRadius: 8, // Adds rounded corners
        backgroundColor: "#f0f0f0", // Fallback background color while loading
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
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
