import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
} from "react-native";
import { router } from "expo-router";
import { auth } from "../../firebase";

import Colors from "../../constent/Colors";
import CustomeFonts from "../../constent/customeFonts";
import CustomButton from "../../component/CustomButton"; // Import button
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function WelcomeScreen() {
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        router.replace("ShopScreen");
      }
      return () => unsubscribe();
    });
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/StartupImages/Start.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.itemContainer}>
          {/* Carrot Image */}
          <Image
            source={require("../../assets/StartupImages/carrot_white.png")} // Ensure the correct path
            style={styles.carrotImage}
            resizeMode="contain"
          />

          <Text style={styles.titelText}>Welcome</Text>
          <Text style={styles.titelText}>to our store</Text>
          <Text style={styles.text}>
            Get your groceries in as fast as one hour
          </Text>

          {/* Reusable Button */}
          <CustomButton title="Get Started" onPress={() => router.push("/LoginScreen")} />
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
    alignItems: "center"
  },
  itemContainer: {
    alignItems: "center",
    width: "100%",
    paddingBottom: wp("25%"),
  },
  carrotImage: {
    width: wp("14%"), // Adjust size as needed
    height: wp("14%"),
    marginBottom: wp("5%"),
  },
  titelText: {
    fontFamily: CustomeFonts.Gilroy_ExtraBold,
    fontSize: 30,
    color: Colors.Secondary,
  },
  text: {
    marginTop: 15,
    fontFamily: CustomeFonts.Gilroy_Light,
    fontSize: 15,
    color: Colors.Secondary,
    textAlign: "center",
  },
});
