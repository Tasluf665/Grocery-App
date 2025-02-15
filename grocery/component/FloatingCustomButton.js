import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../constent/Colors';
import customeFonts from '../constent/customeFonts';

const FloatingCustomButton = ({ onPress, title, disabled }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={[styles.button, disabled && styles.disabled]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: hp('2%'),
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        width: wp('90%'),
        height: hp('7%'),
        borderRadius: 15,
        backgroundColor: Colors.Primary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 20,
        color: Colors.Secondary,
        fontFamily: customeFonts.Gilroy_ExtraBold,
    },
    disabled: {
        opacity: 0.6,
    }
});

export default FloatingCustomButton;