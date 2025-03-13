import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../../constent/Colors';
import customeFonts from '../../constent/customeFonts';
import { AntDesign } from '@expo/vector-icons';

import { useSelector, useDispatch } from "react-redux";
import { fetchPayments } from '../../utils/paymentsSlice';
import LoadingActivityIndicator from '../../component/LoadingActivityIndicator';
import { useRouter } from "expo-router";

const OrderScreen = () => {
    const dispatch = useDispatch();
    const { payments, loading, error } = useSelector((state) => state.payments);
    const router = useRouter();

    useEffect(() => {
        dispatch(fetchPayments());
    }, []);

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 24 }} ></View>
            </View>

            <FlatList
                data={payments}
                keyExtractor={(item) => item.paymentId}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        {/* Order Header */}
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={styles.orderId}>Order #{item.paymentId.slice(-6)}</Text>
                                <Text style={styles.orderDate}>{formatDate(item.timestamp)}</Text>
                            </View>
                            <Text style={styles.orderTotal}>${item.amount}</Text>
                        </View>

                        {/* Order Items */}
                        {item.items.map((product) => {
                            let price = 0;
                            try {
                                price = parseFloat(product.price);
                                if (isNaN(price)) {
                                    price = 0;
                                }
                            } catch (error) {
                                price = 0;
                            }
                            return (
                                <View key={product.id} style={styles.productItem}>
                                    <Image source={{ uri: product.image }} style={styles.productImage} />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        <Text style={styles.productMeta}>
                                            {product.quantity} x ${price.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text style={styles.productTotal}>
                                        ${(product.quantity * price).toFixed(2)}
                                    </Text>
                                </View>
                            );
                        })}

                        {/* Order Status */}
                        <View style={styles.statusContainer}>
                            <AntDesign name="checkcircle" size={16} color={Colors.Primary} />
                            <Text style={styles.statusText}>Completed</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <AntDesign name="inbox" size={60} color={Colors.DarkGray} />
                        <Text style={styles.emptyText}>No orders yet</Text>
                    </View>
                }
            />
        </View>
    );
};

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
        marginBottom: hp(2)
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    orderCard: {
        backgroundColor: Colors.Secondary,
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: wp('4%'),
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBorderColor,
        paddingBottom: hp('1%'),
        marginBottom: hp('1%'),
    },
    orderId: {
        fontFamily: customeFonts.Lato_Bold,
        fontSize: 16,
        color: Colors.PrimaryText,
    },
    orderDate: {
        fontFamily: customeFonts.Lato_Regular,
        fontSize: 12,
        color: Colors.DarkGray,
        marginTop: 4,
    },
    orderTotal: {
        fontFamily: customeFonts.Gilroy_Bold,
        fontSize: 16,
        color: Colors.Primary,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp('1%'),
    },
    productImage: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: 8,
        marginRight: wp('3%'),
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontFamily: customeFonts.Lato_SemiBold,
        fontSize: 14,
        color: Colors.PrimaryText,
    },
    productMeta: {
        fontFamily: customeFonts.Lato_Regular,
        fontSize: 12,
        color: Colors.DarkGray,
        marginTop: 4,
    },
    productTotal: {
        fontFamily: customeFonts.Lato_Bold,
        fontSize: 14,
        color: Colors.Primary,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingTop: hp('1%'),
        borderTopWidth: 1,
        borderTopColor: Colors.inputBorderColor,
    },
    statusText: {
        fontFamily: customeFonts.Lato_SemiBold,
        fontSize: 14,
        color: Colors.Primary,
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('20%'),
    },
    emptyText: {
        fontFamily: customeFonts.Lato_Regular,
        fontSize: 16,
        color: Colors.DarkGray,
        marginTop: hp('2%'),
    },
});

export default OrderScreen;