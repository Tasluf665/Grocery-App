import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from "expo-router";

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text>LoginScreen</Text>
            <Button title='Login' onPress={() => router.replace("ShopScreen")} />
            <Button title='Signup' onPress={() => router.push("SignupScreen")} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})