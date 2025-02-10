import React, { useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import ProductCard from "../../component/ProductCard";
import { fetchProductsBySearch } from "../../utils/fetchProducts"; // Import search function
import { getSpecialSections } from "../../utils/specialSectionsSlice"; // Import Redux action

import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import SearchProductCard from "../../component/SearchProductCard";

export default function ShopScreen() {
    const dispatch = useDispatch();
    const router = useRouter();

    // 🔹 Get sections & loading state from Redux store
    const { sections, loading } = useSelector((state) => state.specialSections);

    // Search state
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Fetch special sections when component mounts
    useEffect(() => {
        dispatch(getSpecialSections()); // 🔹 Dispatch Redux action
    }, [dispatch]);

    // Debounced Search Function (Only API Call)
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                const results = await fetchProductsBySearch(query);
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        }, 500), // 🔹 500ms delay before making API call
        []
    );

    // Handle Search Input (Instant UI Update)
    const handleSearchInput = (query) => {
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle "See All" Click
    const handleSeeAllClick = (sectionId) => {
        router.push(`/ProductCategoryScreen?id=${sectionId}&type=special_section`);
    };

    // Handle Product Click
    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    // Render a single section
    const renderSection = ({ item: section }) => (
        <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.name}</Text>
                <TouchableOpacity onPress={() => handleSeeAllClick(section.id, section.name)}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={section.products.slice(0, 6)}
                renderItem={({ item }) => <ProductCard product={item} />} // 🔹 Use reusable component
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );

    const renderProductCard = ({ item }) => (
        <SearchProductCard item={item} onPress={handleProductClick} />
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search Store"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchInput}
                />
            </View>

            {/* Main List (Either Search Results OR Sections) */}
            <FlatList
                key={searchResults.length > 0 ? "searchGrid" : "sectionsList"} // 🔹 Force re-render when switching
                data={searchResults.length > 0 ? searchResults : sections}
                renderItem={searchResults.length > 0 ? renderProductCard : renderSection}
                keyExtractor={(item) => item.id}
                numColumns={searchResults.length > 0 ? 2 : 1} // 🔹 Avoid dynamic changes
                columnWrapperStyle={searchResults.length > 0 ? styles.row : null}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
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
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "green",
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
});
