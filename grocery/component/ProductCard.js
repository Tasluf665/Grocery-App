import React, { useState } from "react";
import { Text, Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { addToCart, fetchCart } from "../utils/cartSlice";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../constent/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";


const ProductCard = ({ product, onOpenSnackBar }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [nameLines, setNameLines] = useState(1); // Track number of lines in product name

    const handleProductClick = () => {
        router.push(`/ProductDetailsScreen?id=${product.id}`);
    };

    return (
        <TouchableOpacity onPress={handleProductClick} style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
            </View>

            <View style={styles.textContainer}>
                <Text
                    style={styles.productName}
                    numberOfLines={2}
                    onTextLayout={(e) => setNameLines(e.nativeEvent.lines.length)}
                >
                    {product.name}
                </Text>
                <Text
                    style={[
                        styles.productDescription,
                        { marginTop: nameLines === 1 ? 15 : 5 } // Adjust spacing based on lines
                    ]}
                    numberOfLines={1}
                >
                    {product.priceDescription}
                </Text>
            </View>

            <View style={styles.priceContainer}>
                <Text style={styles.productPrice}>${product.price}</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={async () => {
                        await dispatch(addToCart({ productId: product.id }));
                        await dispatch(fetchCart());
                        onOpenSnackBar();
                    }}
                >
                    <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: wp("42%"),
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.inputBorderColor,
        padding: 15,
        marginRight: 15,
        marginBottom: 15,
        justifyContent: "space-between",
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginBottom: 12,
    },
    productImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "left",
        lineHeight: 20,
    },
    productDescription: {
        fontSize: 12,
        color: "#666",
        textAlign: "left",
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    addButton: {
        backgroundColor: Colors.Primary,
        borderRadius: 17,
        width: 34,
        height: 34,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ProductCard;