import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="ShopScreen"
                options={{
                    title: 'Shop',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="ExploreScreen"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="CartScreen"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="shopping-cart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="FavouriteScreen"
                options={{
                    title: 'Favourite',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="star" color={color} />,
                }}
            />
            <Tabs.Screen
                name="AccountScreen"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
};
