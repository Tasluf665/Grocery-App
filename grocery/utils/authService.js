import { Alert } from 'react-native'
import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";


export const handleSignup = async (username, email, password) => {
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

export const handleSigin = async (email, password) => {
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

export const handleForgotPassword = async (email) => {
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Password reset email sent!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error sending password reset email.");
        }
    } else {
        Alert.alert("Please enter your email address first.");
    }
};