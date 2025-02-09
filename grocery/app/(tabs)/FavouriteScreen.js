import React, { useEffect } from "react";
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../utils/favoritesSlice";
import { useRouter } from "expo-router";

export default function FavouriteScreen() {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites);
    console.log(favorites);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchFavorites());
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#5DB075" />
                <Text style={styles.loaderText}>Loading Favourites...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Title */}
            <Text style={styles.headerTitle}>Favourite</Text>

            {/* Favorite List */}
            {favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleProductClick(item.id)} style={styles.itemContainer}>
                            <Image source={{ uri: item.image || "https://via.placeholder.com/50" }} style={styles.productImage} />
                            <View style={styles.textContainer}>
                                <Text style={styles.productName}>{item.name || "Loading..."}</Text>
                                <Text style={styles.productSize}>325ml, Price</Text>
                            </View>
                            <Text style={styles.productPrice}>${item.price || "--"}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <View style={styles.noFavoritesContainer}>
                    <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
                </View>
            )}

            {/* Add All to Cart Button */}
            {favorites.length > 0 && (
                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add All To Cart</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderText: {
        fontSize: 16,
        marginTop: 10,
        color: "#555",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#f0f0f0",
    },
    textContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    productSize: {
        fontSize: 14,
        color: "#777",
        marginTop: 2,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    noFavoritesContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noFavoritesText: {
        fontSize: 16,
        color: "#777",
    },
    addToCartButton: {
        backgroundColor: "#5DB075",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    addToCartText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});

