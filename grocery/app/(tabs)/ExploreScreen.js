import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../utils/categoriesSlice"; // Import Redux action
import { searchProducts } from "../../utils/searchSlice"; // Import Redux search action
import { debounce } from "lodash";

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
                <TextInput
                    placeholder="Search Categories"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchInput} // 🔹 Calls function that updates instantly
                />
            </View>

            {/* Show Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {searchLoading && <ActivityIndicator size="small" color="green" />}

            {/* Categories Grid using FlatList */}
            <FlatList
                key={searchResults.length > 0 ? "searchGrid" : "categoriesList"} // 🔹 Force re-render when switching
                data={searchResults.length > 0 ? searchResults : categories}
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
