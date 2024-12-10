import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { router } from "expo-router";

export default function ProducteCategoryScreen() {
    return (
        <View>
            <Text>ProducteCategoryScreen</Text>
            <Button title='Go to Product Category'
                onPress={() => router.push("ProductDetailsScreen")}
            />
        </View>
    )
}

const styles = StyleSheet.create({})