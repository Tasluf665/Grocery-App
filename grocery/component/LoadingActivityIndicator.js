import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'
import Colors from '../constent/Colors'

export default function LoadingActivityIndicator() {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})