import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../utils/categoriesSlice"; // Import Redux action
import { searchProducts } from "../../utils/searchSlice"; // Import Redux search action
import { debounce } from "lodash";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import ExplorePageColor from "../../constent/ExplorePageColor";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import customeFonts from "../../constent/customeFonts";

import SearchBar from "../../component/SearchBar";
import Colors from "../../constent/Colors";
import ProductCard from "../../component/ProductCard";

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
    const handleCategoryClick = (item) => {
        router.push(`/ProductCategoryScreen?id=${item.id}&type=categories&title=${item.name}`);
    };


    const renderCategoryCard = ({ item, index }) => {
        // Get colors based on index (cycle through the array)
        const colorIndex = index % ExplorePageColor.length;
        const { Primary, Border } = ExplorePageColor[colorIndex];

        return (
            <TouchableOpacity
                onPress={() => handleCategoryClick(item)}
                style={[styles.card, { backgroundColor: Primary, borderColor: Border }]}
            >
                <View style={[styles.imageContainer]}>
                    <Image source={{ uri: item.image }} style={styles.categoryImage} />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderProductCard = ({ item }) => (
        <ProductCard product={item} />
    );

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Find Products</Text>

            <SearchBar
                placeholder="Search Store"
                value={searchQuery}
                onChangeText={handleSearchInput}
            />

            {/* Show Loading Indicator */}
            {searchLoading ? <LoadingActivityIndicator /> :
                <FlatList
                    key={searchResults.length > 0 ? "searchGrid" : "categoriesList"} // 🔹 Force re-render when switching
                    data={searchResults.length > 0 ? searchResults : categories}
                    renderItem={searchResults.length > 0 ? renderProductCard : renderCategoryCard}
                    keyExtractor={(item) => item.id}
                    numColumns={2} // Display as a grid
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.flatListContainer}
                    showsVerticalScrollIndicator={false}
                />}

            {/* Categories Grid using FlatList */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
        padding: 20,
    },
    flatListContainer: {
        paddingBottom: 20, // Prevents last item from being cut off
    },
    headerTitle: {
        fontSize: 22,
        textAlign: "center",
        marginBottom: hp("3%"),
        fontFamily: customeFonts.Lato_Bold,
    },

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
    row: {
        justifyContent: "space-between",
    },

    card: {
        width: wp("43%"), // Adjust width based on screen size
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: "center",
        borderWidth: 1, // Add border
    },
    categoryImage: {
        width: wp("28%"), // Adjust width based on screen size
        height: wp("28%"),
        resizeMode: "contain",
    },
    categoryName: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold,
        textAlign: "center",
        paddingHorizontal: 5
    },
    imageContainer: {
        marginBottom: hp("1.5%"),
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
