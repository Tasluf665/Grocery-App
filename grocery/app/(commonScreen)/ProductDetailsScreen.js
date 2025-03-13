import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchProductDetails } from "../../utils/fetchProducts";
import { AntDesign } from "@expo/vector-icons"; // Favorite icon
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../utils/favoritesSlice";
import { addToCart, fetchCart } from "../../utils/cartSlice";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import customeFonts from "../../constent/customeFonts";
import CustomButton from "../../component/CustomButton";
import Colors from "../../constent/Colors";


export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.favorites);

    useEffect(() => {
        if (id) {
            fetchProductDetails(id).then((data) => {
                setProduct(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    if (!product) {
        return <Text style={styles.errorText}>Product not found.</Text>;
    }

    const isFavorite = favorites.some((fav) => fav.id === product.id);

    const toggleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(product.id));
        } else {
            dispatch(addFavorite(product.id));
        }
    };

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleAddToCart = async () => {
        await dispatch(addToCart({ productId: product.id, quantity })); // Pass the quantity
        await dispatch(fetchCart());
        setQuantity(1); // Reset quantity

    };

    return (
        <ScrollView style={styles.container}>
            {/* Product Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Product Details */}
            <View style={styles.headerRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <TouchableOpacity onPress={toggleFavorite}>
                    <AntDesign name={isFavorite ? "heart" : "hearto"} size={22} color={isFavorite ? "red" : "black"} />
                </TouchableOpacity>
            </View>
            <Text style={styles.productSize}>{product.priceDescription}</Text>

            {/* Quantity and Price */}
            <View style={styles.quantityRow}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                        <AntDesign name="minus" size={18} color={Colors.DarkGray} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                        <AntDesign name="plus" size={18} color={Colors.Primary} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.productPrice}>${(product.price * quantity).toFixed(2)}</Text>
            </View>

            {/* Product Description */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Detail</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
            </View>

            {/* Nutritions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutritions</Text>
                <View style={styles.nutritionContainer}>
                    {product.nutrition.map((nutrient, index) => (
                        <View key={index} style={styles.nutritionBadge}>
                            <Text style={styles.nutritionText}>{nutrient}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Reviews */}
            <View style={styles.section}>
                <View style={styles.reviewRow}>
                    <Text style={styles.sectionTitle}>Review</Text>
                    <View style={styles.reviewContainer}>
                        {[...Array(5)].map((_, index) => (
                            <AntDesign
                                key={index}
                                name={index < product.rating ? "star" : "staro"}
                                size={16}
                                color="orange"
                            />
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton title="Add To Basket" onPress={handleAddToCart} />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: wp(5),
        paddingTop: hp(3),
    },
    productImage: {
        width: "100%",
        height: hp(30),
        resizeMode: "contain",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp(4),
    },
    productName: {
        fontSize: 20,
        fontFamily: customeFonts.Lato_Bold,
        flex: 1,
        marginRight: 10,
    },
    productSize: {
        fontSize: 14,
        color: "gray",
        marginVertical: 5,
    },
    quantityRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 20,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    quantityButton: {
        padding: 5,
        paddingHorizontal: 7,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.Primary,
    },
    section: {
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",
        paddingVertical: hp(1.5),
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: customeFonts.Lato_Bold,
        paddingVertical: 5
    },
    productDescription: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,

    },
    nutritionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: hp(1),
    },
    nutritionBadge: {
        backgroundColor: Colors.Primary,
        borderRadius: 5,
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(3),
        marginRight: wp(2),
        marginBottom: hp(1),
    },
    nutritionText: {
        fontSize: Math.min(16, wp(3.5)),
        fontFamily: customeFonts.Lato_Medium,
        color: Colors.Secondary,
    },
    reviewRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp(1),
        justifyContent: "space-between",
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonContainer: {
        alignItems: "center",
        marginBottom: hp(5),
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
