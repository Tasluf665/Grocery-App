import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from "expo-router";
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import { auth } from "../../firebase";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSigin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (!auth.currentUser.emailVerified) {
                await sendEmailVerification(auth.currentUser);
                Alert.alert(
                    "Your Email is not verified. Please verify your email first"
                );
                await signOut(auth);
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>LoginScreen</Text>
            <Text>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title='Login' onPress={handleSigin} />
            <Button title='Signup' onPress={() => router.push("SignupScreen")} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        width: '80%'
    }
})