import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; // Firebase imports
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { AntDesign, MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";

export default function AccountScreen() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserInfo(userSnap.data());
                    } else {
                        console.error("No user document found.");
                    }
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("LoginScreen");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Unable to logout. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={{
                        uri: "https://via.placeholder.com/80", // Replace with user profile image URL
                    }}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.profileName}>{userInfo?.username || "Guest"}</Text>
                    <Text style={styles.profileEmail}>{userInfo?.email || "No email available"}</Text>
                </View>
                <TouchableOpacity style={styles.editIcon}>
                    <AntDesign name="edit" size={20} color="green" />
                </TouchableOpacity>
            </View>

            {/* Menu Options */}
            <View style={styles.menuSection}>
                <MenuItem icon={<Ionicons name="cart-outline" size={24} color="black" />} title="Orders" />
                <MenuItem icon={<MaterialIcons name="person-outline" size={24} color="black" />} title="My Details" />
                <MenuItem icon={<Ionicons name="location-outline" size={24} color="black" />} title="Delivery Address" />
                <MenuItem icon={<Feather name="credit-card" size={24} color="black" />} title="Payment Methods" />
                <MenuItem icon={<MaterialIcons name="local-offer" size={24} color="black" />} title="Promo Code" />
                <MenuItem icon={<Ionicons name="notifications-outline" size={24} color="black" />} title="Notifications" />
                <MenuItem icon={<Ionicons name="help-circle-outline" size={24} color="black" />} title="Help" />
                <MenuItem icon={<Ionicons name="information-circle-outline" size={24} color="black" />} title="About" />
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="green" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const MenuItem = ({ icon, title }) => (
    <TouchableOpacity style={styles.menuItem}>
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    profileEmail: {
        fontSize: 14,
        color: "gray",
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
        fontWeight: "bold",
        color: "green",
        marginLeft: 10,
    },
});
