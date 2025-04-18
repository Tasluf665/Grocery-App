import { Stack } from "expo-router";

export default () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProductDetailsScreen" />
            <Stack.Screen name="ProducteCategoryScreen" />
            <Stack.Screen name="SearchScreen"
                options={{
                    presentation: "modal"
                }}
            />
            <Stack.Screen name="IncompleteScreen" />
            <Stack.Screen name="HelpScreen" />
            <Stack.Screen name="AboutScreen" />
            <Stack.Screen name="MyDetailsScreen" />
        </Stack>
    );
};
