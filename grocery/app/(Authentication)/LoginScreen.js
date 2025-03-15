import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, forgotPassword, resetError } from "../../utils/authSlice";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import CustomInput from "../../component/CustomInput";
import CustomButton from "../../component/CustomButton";
import customeFonts from "../../constent/customeFonts";
import Colors from "../../constent/Colors";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";
import ErrorDialog from "../../component/ErrorDialog";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { loading, loginError, user } = useSelector((state) => state.auth);
    const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);
    const [errorForgotDialogVisible, setErrorForgotDialogVisible] = React.useState(false);

    const hideErrorDialog = () => {
        setErrorDialogVisible(false);
    };

    const hideErrorForgotDialog = () => {
        setErrorForgotDialogVisible(false);
    };

    const handleLogin = () => {
        if (!email || !password) {
            setErrorDialogVisible(true);
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    const handleForgotPassword = () => {
        if (!email) {
            setErrorForgotDialogVisible(true);
            return;
        }
        dispatch(forgotPassword(email));
    };

    useEffect(() => {
        if (loginError) {
            setTimeout(() => {
                dispatch(resetError());
            }, 3000);
        }
    }, [loginError, dispatch]);

    const getErrorMessage = (error) => {
        const match = error.match(/\(auth\/([^)]+)\)/);
        if (match) {
            const errorCode = match[1];
            switch (errorCode) {
                case "invalid-credential":
                case "user-not-found":
                case "wrong-password":
                    return "Email or Password is incorrect";
                case "user-disabled":
                    return "This user has been disabled";
                case "too-many-requests":
                    return "Please verify your email first";
                default:
                    return error;
            }
        }
        return error;
    };

    if (loading) {
        return <LoadingActivityIndicator />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Carrot Logo */}
                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/StartupImages/carrot.png")} style={styles.logo} />
                </View>

                {/* Title */}
                <Text style={styles.title}>Log in</Text>
                <Text style={styles.subtitle}>Enter your email and password</Text>

                {/* Error Message */}
                {loginError && (
                    <Text style={styles.error}>
                        {getErrorMessage(loginError)}
                    </Text>
                )}

                {/* Email Input */}
                <CustomInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password Input */}
                <CustomInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    isPassword
                />

                <ErrorDialog
                    visible={errorDialogVisible}
                    onDismiss={hideErrorDialog}
                    title="Error"
                    message="Please enter email and password."
                />

                <ErrorDialog
                    visible={errorForgotDialogVisible}
                    onDismiss={hideErrorForgotDialog}
                    title="Error"
                    message="Please enter your email first."
                />

                {/* Forgot Password */}
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <View style={styles.buttonContainer}>
                    <CustomButton title="Log In" onPress={handleLogin} disabled={loading} />
                </View>

                {/* Signup Link */}
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don’t have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("SignupScreen")}>
                        <Text style={styles.signupLink}> Signup</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Secondary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: wp("6%"),
        paddingTop: hp("8%"),
        paddingBottom: hp("5%"),
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: hp("5%"),
    },
    logo: {
        width: 80,  // Adjust size based on your asset
        height: 80,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "left",
        marginBottom: 5,
        fontFamily: customeFonts.Gilroy_ExtraBold,
    },
    subtitle: {
        fontSize: 16,
        color: "gray",
        marginBottom: hp("4%"),
        fontFamily: customeFonts.Gilroy_Light,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    forgotPassword: {
        textAlign: "right",
        color: "gray",
        marginBottom: hp("3%"),
        fontFamily: customeFonts.Gilroy_ExtraBold,
    },
    buttonContainer: {
        alignItems: "center",
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp("3%"),
    },
    signupText: {
        color: "gray",
        fontFamily: customeFonts.Gilroy_Light,
    },
    signupLink: {
        color: Colors.Primary,
        fontFamily: customeFonts.Gilroy_ExtraBold,
        fontSize: 16,
    },
});