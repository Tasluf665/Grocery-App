import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { router } from "expo-router";

export default function ExploreScreen() {
    return (
        <View>
            <Text>ExploreScreen</Text>
            <Button title='Go to Product Category'
                onPress={() => router.push("ProducteCategoryScreen")}
            />
            <Button title='Go to Search Screen'
                onPress={() => router.push("SearchScreen")}
            />
        </View>
    )
}

const styles = StyleSheet.create({})