import React, { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, addToCart, decreaseFromCart } from "../../utils/cartSlice";
import { AntDesign } from "@expo/vector-icons"; // Icons for + and - buttons

import { useStripe } from "@stripe/stripe-react-native"; // Import Stripe Hook
import { db, auth } from "../../firebase"; // Import Firebase
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { stripe_secretKey } from "@env";

export default function CartScreen() {
    const dispatch = useDispatch();
    const { cart, loading } = useSelector((state) => state.cart);
    const stripe = useStripe(); // Initialize Stripe

    useEffect(() => {
        dispatch(fetchCart());
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        try {
            // 🔹 Step 1: Create PaymentIntent
            const paymentIntent = await createPaymentIntent();
            if (!paymentIntent) return;

            console.log("PaymentIntent:", paymentIntent);

            // 🔹 Step 2: Initialize PaymentSheet
            const { error: initError } = await stripe.initPaymentSheet({
                paymentIntentClientSecret: paymentIntent.client_secret,
                merchantDisplayName: "Your Store Name", // ✅ Add a store name
                allowsDelayedPaymentMethods: false, // ✅ Ensure only immediate payments
            });

            if (initError) {
                console.error("Error initializing PaymentSheet:", initError);
                alert(`PaymentSheet init failed: ${initError.message}`);
                return;
            }

            // 🔹 Step 3: Present PaymentSheet
            const { error } = await stripe.presentPaymentSheet();

            if (error) {
                alert(`Payment failed: ${error.message}`);
            } else {
                alert("Payment successful!");
                await savePaymentToFirestore(paymentIntent.id);
                dispatch(fetchCart()); // Refresh cart after checkout
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong with payment.");
        }
    };

    // 🔹 Create PaymentIntent (Using Stripe API Key Directly)
    const createPaymentIntent = async () => {
        try {
            const response = await fetch("https://api.stripe.com/v1/payment_intents", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${stripe_secretKey}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    amount: Math.round(calculateTotal() * 100), // Convert to cents
                    currency: "usd",
                    "payment_method_types[]": "card",
                }).toString(),
            });

            return await response.json();
        } catch (error) {
            console.error("Error creating PaymentIntent:", error);
            return null;
        }
    };

    // 🔹 Save Payment to Firebase
    const savePaymentToFirestore = async (paymentId) => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            payments: arrayUnion({
                paymentId,
                amount: calculateTotal(),
                timestamp: new Date().toISOString(),
                items: cart,
            }),
            cart: [], // Clear the cart after successful payment
        });

        dispatch(fetchCart()); // Refresh cart in Redux
    };


    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>My Cart</Text>

            <FlatList
                data={cart}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productSize}>{item.size || "1kg, Price"}</Text>
                        </View>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => dispatch(decreaseFromCart(item.id))}>
                                <AntDesign name="minus" size={20} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => dispatch(addToCart(item.id))}>
                                <AntDesign name="plus" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                            <AntDesign name="close" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Go to Checkout</Text>
                <Text style={styles.checkoutPrice}>${calculateTotal()}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    productImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    productDetails: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productSize: {
        fontSize: 12,
        color: "gray",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
    },
    checkoutButton: {
        flexDirection: "row",
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    checkoutText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginRight: 10,
    },
    checkoutPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});
