import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from "expo-router";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
} from "firebase/auth";
import { auth } from "../../firebase";

export default function SignupScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(auth.currentUser, {
                displayName: username,
            });

            await sendEmailVerification(auth.currentUser);

            Alert.alert(
                "An email is send for verification. Verify your email and log in into your account"
            );
            await signOut(auth);
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>SignupScreen</Text>
            <Text>Username</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
            />
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
            <Button title='Signup' onPress={handleSignup} />
            <Button title='Login' onPress={() => router.back()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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