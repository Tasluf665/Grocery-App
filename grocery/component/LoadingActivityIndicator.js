import { StyleSheet, View, ActivityIndicator } from 'react-native'
import React from 'react'

export default function LoadingActivityIndicator() {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#5DB075" />
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