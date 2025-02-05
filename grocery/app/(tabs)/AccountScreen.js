import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { router } from "expo-router";

export default function AccountScreen() {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("LoginScreen");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View style={styles.container}>
            <Text>AccountScreen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})