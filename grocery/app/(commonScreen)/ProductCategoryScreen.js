import React, { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCategoryOrSection } from "../../utils/productsSlice"; // Redux action

export default function ProductCategoryScreen() {
    const { id, type } = useLocalSearchParams(); // Get category ID and type from URL query params
    const dispatch = useDispatch();
    const router = useRouter();

    // 🔹 Get products & loading state from Redux store
    const { products, loading } = useSelector((state) => state.products);

    // Fetch products when component mounts
    useEffect(() => {
        if (id) {
            dispatch(getProductsByCategoryOrSection({ id, type })); // 🔹 Dispatch Redux action
        }
    }, [id, type, dispatch]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Handle Product Click
    const handleProductClick = (productId) => {
        router.push(`/ProductDetailsScreen?id=${productId}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Products</Text>

            <FlatList
                data={products}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductClick(item.id)} style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.price}</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2} // Grid layout
                columnWrapperStyle={styles.row}
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
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
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
    productImage: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
    },
    productPrice: {
        fontSize: 14,
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
