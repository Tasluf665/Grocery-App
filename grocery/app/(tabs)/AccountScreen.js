import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import customeFonts from "../../constent/customeFonts";
import Colors from "../../constent/Colors";
import ErrorDialog from "../../component/ErrorDialog";
import { logoutUser, resetError } from "../../utils/authSlice";

export default function AccountScreen() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
        dispatch(resetError());
    };

    useEffect(() => {
        if (error) {
            setErrorDialogVisible(true);
        }
    }, [error]);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            router.replace("LoginScreen");
        } catch (error) {
            console.error(error);
            setErrorDialogVisible(true);
        }
    };

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Text style={styles.profileName}>{user?.username || "Guest"}</Text>
                <Text style={styles.profileEmail}>{user?.email || "No email available"}</Text>
            </View>

            {/* Menu Options */}
            <View style={styles.menuSection}>
                <MenuItem onPress={() => router.push("/OrderScreen")} icon={<Ionicons name="cart-outline" size={24} color="black" />} title="Orders" />
                <MenuItem onPress={() => router.push("/MyDetailsScreen")} icon={<MaterialIcons name="person-outline" size={24} color="black" />} title="My Details" />
                <MenuItem onPress={() => router.push("/IncompleteScreen")} icon={<Ionicons name="location-outline" size={24} color="black" />} title="Delivery Address" />
                <MenuItem onPress={() => router.push("/IncompleteScreen")} icon={<Feather name="credit-card" size={24} color="black" />} title="Payment Methods" />
                <MenuItem onPress={() => router.push("/IncompleteScreen")} icon={<MaterialIcons name="local-offer" size={24} color="black" />} title="Promo Code" />
                <MenuItem onPress={() => router.push("/IncompleteScreen")} icon={<Ionicons name="notifications-outline" size={24} color="black" />} title="Notifications" />
                <MenuItem onPress={() => router.push("/HelpScreen")} icon={<Ionicons name="help-circle-outline" size={24} color="black" />} title="Help" />
                <MenuItem onPress={() => router.push("/AboutScreen")} icon={<Ionicons name="information-circle-outline" size={24} color="black" />} title="About" />
            </View>

            <ErrorDialog
                visible={errorDialogVisible}
                onDismiss={hideErrorDialog}
                title="Error"
                message="Unable to logout. Please try again."
            />

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={Colors.Primary} />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="gray" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    profileSection: {
        marginBottom: 20,
        backgroundColor: Colors.Secondary,
        borderRadius: 10,
        paddingHorizontal: wp(5),
        paddingVertical: hp(3),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        alignItems: "center",
        marginTop: 10
    },
    profileName: {
        fontSize: 18,
        fontFamily: customeFonts.Lato_Bold
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.DarkGray
    },
    editIcon: {
        marginLeft: "auto",
    },
    menuSection: {
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
        paddingVertical: 15,
        borderRadius: 10,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: customeFonts.Lato_Bold,
        color: Colors.Primary,
        marginLeft: 10,
    },
});