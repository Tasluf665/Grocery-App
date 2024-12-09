import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from "expo-router";

export default function SignupScreen() {
    return (
        <View style={styles.container}>
            <Text>SignupScreen</Text>
            <Button title='Signup' onPress={() => router.replace("Main")} />
            <Button title='Login' onPress={() => {
                router.back()
            }} />
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