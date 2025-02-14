import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../utils/authSlice";
import CustomInput from "../../component/CustomInput";
import CustomButton from "../../component/CustomButton";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import customeFonts from "../../constent/customeFonts";
import Colors from "../../constent/Colors";
import LoadingActivityIndicator from "../../component/LoadingActivityIndicator";

export default function SignupScreen() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignupPress = () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }

        dispatch(signupUser({ username, email, password }))
            .unwrap()
            .then(() => {
                Alert.alert("Success", "Account created! Verify your email.");
                router.back();
            })
            .catch((err) => {
                Alert.alert("Signup Failed", err);
            });
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

                <View style={styles.logoContainer}>
                    <Image source={require("../../assets/StartupImages/carrot.png")} style={styles.logo} />
                </View>

                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Enter your credentials to continue</Text>


                {/* Error Message */}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* Input Fields */}
                <CustomInput
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                />

                <CustomInput
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <CustomInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    isPassword
                />

                {/* Terms Text */}
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                        By continuing you agree to our{" "}
                        <Text style={styles.highlightText}>Terms of Service</Text> and{" "}
                        <Text style={styles.highlightText}>Privacy Policy</Text>
                    </Text>
                </View>

                {/* Signup Button */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignupPress}
                        disabled={loading}
                    />
                </View>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.loginLink}>Login</Text>
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
    termsContainer: {
        marginVertical: hp(2),
        alignItems: "center",
    },
    termsText: {
        fontSize: hp(1.8),
        fontFamily: customeFonts.Lato_Regular,
        color: Colors.DarkGray,
        textAlign: "center",
    },
    highlightText: {
        color: Colors.Primary,
        fontFamily: customeFonts.Gilroy_ExtraBold,
    },
    buttonContainer: {
        alignItems: "center",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: hp(3),
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontFamily: customeFonts.Gilroy_Light,
        color: Colors.Grey,
    },
    loginLink: {
        color: Colors.Primary,
        fontFamily: customeFonts.Gilroy_ExtraBold,
        fontSize: 16,
    },
    errorText: {
        color: Colors.Red,
        textAlign: "center",
        marginTop: hp(2),
        fontFamily: customeFonts.Gilroy_Medium,
    },
});