import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {Colors} from '../colors/Colors';


import FeedNavigation from '../navigation/FeedNavigation';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileNavigation from './ProfileNavigation';
import DrawerNavigation from './DrawerNavigation';

const BottomTab = createBottomTabNavigator();


export default function LoginNavigation() {
    return (
        <BottomTab.Navigator tabBarOptions={{
            activeTintColor: Colors.primary,
            inactiveTintColor: '#cccccc',
            allowFontScaling: true
        }}>
            <BottomTab.Screen name="Home" component={FeedNavigation}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }} />
            <BottomTab.Screen name="Profile" component={ProfileNavigation} title="Your Profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} />
        </BottomTab.Navigator>
    );
}

