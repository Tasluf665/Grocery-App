import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableNativeFeedback,
} from "react-native";
import { router, useNavigation } from "expo-router";
// import { auth } from "../../firebase";

import Colors from "../../constent/Colors";
import CustomeFonts from "../../constent/customeFonts";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  // React.useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user && user.emailVerified) {
  //       navigation.replace("Main");
  //     }
  //     return () => unsubscribe();
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/StartupImages/Start.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.titelText}>Welcome</Text>
        <Text style={styles.titelText}>to our store</Text>
        <Text style={styles.text}>
          Ger your groceries in as fast as one hour
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableNativeFeedback
            onPress={() => router.push("/LoginScreen")}
          >
            <View style={styles.button}>
              <Text style={[styles.titelText, { fontSize: 20 }]}>
                Get Started
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  titelText: {
    fontFamily: CustomeFonts.Gilroy_Light,
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
  text: {
    marginTop: 25,
    fontFamily: CustomeFonts.Gilroy_Light,
    fontSize: 15,
    color: "white",
  },
  buttonContainer: {
    width: "75%",
    height: 70,
    overflow: "hidden",
    borderRadius: 20,
    marginVertical: 90,
  },
  button: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
