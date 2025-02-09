import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from "expo-router";
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../utils/authSlice'; // ✅ Import Redux action

export default function SignupScreen() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth); // ✅ Get Redux state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignupPress = () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        dispatch(signupUser({ username, email, password }))
            .unwrap()
            .then(() => {
                Alert.alert("Success", "Account created! Verify your email.");
                router.back(); // ✅ Redirect to login
            })
            .catch((err) => {
                Alert.alert("Signup Failed", err);
            });
    };

    return (
        <View style={styles.container}>
            <Text>Signup Screen</Text>
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

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Button title="Signup" onPress={handleSignupPress} />
            )}

            <Button title="Login" onPress={() => router.back()} />

            {error && <Text style={styles.errorText}>{error}</Text>}
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