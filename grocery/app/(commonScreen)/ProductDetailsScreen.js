import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchProductDetails } from "../../utils/fetchProducts";
import { AntDesign } from "@expo/vector-icons"; // Favorite icon
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../utils/favoritesSlice";
import { addToCart, fetchCart } from "../../utils/cartSlice";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";

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
        <View style={styles.container}>
            {/* Product Image */}
            <Image source={{ uri: product.image }} style={styles.productImage} />

            {/* Product Details */}
            <View style={styles.headerRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <TouchableOpacity onPress={toggleFavorite}>
                    <AntDesign name={isFavorite ? "heart" : "hearto"} size={24} color={isFavorite ? "red" : "black"} />
                </TouchableOpacity>
            </View>
            <Text style={styles.productSize}>1kg, Price</Text>

            {/* Quantity and Price */}
            <View style={styles.quantityRow}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                        <AntDesign name="minus" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                        <AntDesign name="plus" size={18} color="black" />
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
                <Text style={styles.nutritionBadge}>100gr</Text>
            </View>

            {/* Reviews */}
            <TouchableOpacity style={styles.section}>
                <Text style={styles.sectionTitle}>Review</Text>
                <View style={styles.reviewContainer}>
                    <AntDesign name="star" size={16} color="orange" />
                    <AntDesign name="star" size={16} color="orange" />
                    <AntDesign name="star" size={16} color="orange" />
                    <AntDesign name="star" size={16} color="orange" />
                    <AntDesign name="star" size={16} color="orange" />
                </View>
            </TouchableOpacity>

            {/* Add to Basket */}
            <TouchableOpacity style={styles.addToBasketButton} onPress={handleAddToCart}>
                <Text style={styles.addToBasketText}>Add To Basket</Text>
            </TouchableOpacity>
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
    productImage: {
        width: "100%",
        height: 250,
        resizeMode: "contain",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
        marginRight: 10,
    },
    productSize: {
        fontSize: 16,
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
    },
    quantityButton: {
        padding: 5,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
    },
    section: {
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    productDescription: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
    },
    nutritionBadge: {
        fontSize: 14,
        color: "#fff",
        backgroundColor: "#4CAF50",
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "flex-start",
        marginTop: 5,
    },
    reviewContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    addToBasketButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    addToBasketText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});
