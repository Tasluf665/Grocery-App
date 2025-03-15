import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons"; // For back button icon
import { Snackbar } from 'react-native-paper';

import { getProductsByCategoryOrSection } from "../../utils/productsSlice";
import ProductCard from "../../component/ProductCard";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import Colors from "../../constent/Colors";

export default function ProductCategoryScreen() {
    const { id, type, title } = useLocalSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

    // Snackbar state
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const onOpenSnackBar = () => setSnackbarVisible(true);
    const onDismissSnackBar = () => setSnackbarVisible(false);

    const { products, loading } = useSelector((state) => state.products);

    useEffect(() => {
        if (id) {
            dispatch(getProductsByCategoryOrSection({ id, type }));
        }
    }, [id, type, dispatch]);

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            {/* Header with Back Button and Title */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 24 }} ></View>
            </View>

            {/* Product List */}
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductCard product={item} onOpenSnackBar={onOpenSnackBar} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={onDismissSnackBar}
                style={styles.snackbar}
            >
                Product added to cart!
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorderColor,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    listContent: {
        paddingTop: 15,
        paddingBottom: 20,
        paddingHorizontal: 10,

    },

    snackbar: {
        backgroundColor: Colors.Primary,
        width: '80%',
        alignSelf: 'center',
    },
});