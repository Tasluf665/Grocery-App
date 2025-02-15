import React, { useEffect } from "react";
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../../utils/favoritesSlice";
import { addAllFavoritesToCart } from "../../utils/cartSlice";
import { useRouter } from "expo-router";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Colors from "../../constent/Colors";
import CustomButton from "../../component/CustomButton";
import { AntDesign } from "@expo/vector-icons";
import customeFonts from "../../constent/customeFonts";
import FloatingCustomButton from "../../component/FloatingCustomButton";

export default function FavouriteScreen() {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchFavorites());
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    const handleAddAllToCart = () => {
        dispatch(addAllFavoritesToCart());
    };

    if (loading) {
        return <LoadingActivityIndicator />;
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
                                <Text style={styles.productSize}>{item.priceDescription}</Text>
                            </View>
                            <View style={styles.priceArrowContainer}>
                                <Text style={styles.productPrice}>${item.price || "--"}</Text>
                                <AntDesign name="right" size={16} color={Colors.DarkGray} style={styles.arrowIcon} />
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.flatListContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.noFavoritesContainer}>
                    <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
                </View>
            )}

            {/* Add All to Cart Button */}
            {favorites.length > 0 && (

                <FloatingCustomButton
                    title="Add All To Cart"
                    onPress={handleAddAllToCart}
                    disabled={loading}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        paddingBottom: hp("3%"),
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorderColor,
        paddingTop: hp("1%"),
    },
    flatListContainer: {
        paddingBottom: hp("10%"),
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorderColor,
    },
    productImage: {
        width: 70,
        height: 70,
        marginRight: 10,
        marginTop: 10
    },
    textContainer: {
        flex: 1,
        marginLeft: wp(4)
    },
    productName: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold
    },
    productSize: {
        fontSize: 13,
        color: "#777",
        marginTop: 2,
    },
    priceArrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold,
        marginRight: 8, // Add space between price and arrow
    },
    arrowIcon: {
        marginLeft: 4,
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
});

