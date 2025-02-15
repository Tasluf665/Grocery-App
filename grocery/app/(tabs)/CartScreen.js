import React, { useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, addToCart, decreaseFromCart } from "../../utils/cartSlice";
import { AntDesign } from "@expo/vector-icons"; // Icons for + and - buttons

import { useStripe } from "@stripe/stripe-react-native"; // Import Stripe Hook
import { db, auth } from "../../firebase"; // Import Firebase
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { stripe_secretKey } from "@env";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Colors from "../../constent/Colors";
import customeFonts from "../../constent/customeFonts";

import FloatingCustomButton from "../../component/FloatingCustomButton";

export default function CartScreen() {
    const dispatch = useDispatch();
    const { cart, loading } = useSelector((state) => state.cart);
    const stripe = useStripe(); // Initialize Stripe

    useEffect(() => {
        dispatch(fetchCart());
    }, []);

    if (loading) return <LoadingActivityIndicator />;

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
                merchantDisplayName: "Grocery", // ✅ Add a store name
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
                        {/* Left Side - Product Image */}
                        <Image source={{ uri: item.image }} style={styles.productImage} />

                        {/* Right Side - All Details */}
                        <View style={styles.detailsContainer}>
                            {/* Top Row - Product Name & Close Icon */}
                            <View style={styles.productHeader}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                                    <AntDesign name="close" size={20} color={Colors.DarkGray} />
                                </TouchableOpacity>
                            </View>

                            {/* Product Size */}
                            <Text style={styles.productSize}>{item.priceDescription || "1kg, Price"}</Text>

                            {/* Bottom Row - Quantity Controls & Price */}
                            <View style={styles.quantityPriceRow}>
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => dispatch(decreaseFromCart(item.id))}>
                                        <AntDesign name="minus" size={20} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity onPress={() => dispatch(addToCart({ productId: item.id }))}>
                                        <AntDesign name="plus" size={20} color={Colors.Primary} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContainer}
                showsVerticalScrollIndicator={false}
            />

            <FloatingCustomButton
                title={`Go to Checkout $${calculateTotal()}`}
                onPress={handleCheckout}
                disabled={loading}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
        paddingVertical: wp("4%"),
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        paddingHorizontal: wp("4%"),
        paddingBottom: hp("8%"),
    },

    cartItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        paddingLeft: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorderColor,
    },
    productImage: {
        width: 70,
        height: 70,
        marginRight: 10,
        marginTop: 10
    },
    detailsContainer: {
        flex: 1,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    productName: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold,
        flex: 1,
        marginRight: 8,
    },
    productSize: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
        fontFamily: customeFonts.Lato_Regular
    },
    quantityPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 12,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold,
        color: Colors.Primary
    },

    buttonContainer: {
        position: 'absolute',
        bottom: hp('2%'),
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        width: wp('90%'),  // 90% of screen width
        height: hp('7%'),   // 7% of screen height
        borderRadius: 15,
        backgroundColor: Colors.Primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,      // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 20,
        color: Colors.Secondary,
        fontFamily: customeFonts.Gilroy_ExtraBold,
    },
});
