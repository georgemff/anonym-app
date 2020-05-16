import React from 'react';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../colors/Colors'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const bottomTab = createBottomTabNavigator();

export default function FeedNavigation() {
    return (
        <bottomTab.Navigator initialRouteName="Home" tabBarOptions={{
            activeTintColor: Colors.activeTab,
            inactiveTintColor: Colors.inActiveTab,
            allowFontScaling: true,
            style: {
                backgroundColor: Colors.primary,
                borderTopColor: Colors.borderColor
            }
        }}>
            <bottomTab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),

            }} />
            <bottomTab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
                ),

            }} />
        </bottomTab.Navigator>
    );
}
