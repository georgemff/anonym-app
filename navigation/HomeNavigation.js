import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import {Colors} from '../colors/Colors';

import DrawerNavigation from './DrawerNavigation'
// import FeedNavigation from '../navigation/FeedNavigation';
import ProfileNavigation from './ProfileNavigation';
const BottomTab = createBottomTabNavigator();


export default function LoginNavigation() {
    return (
        <BottomTab.Navigator tabBarOptions={{
            activeTintColor: Colors.activeTab,
            inactiveTintColor: Colors.inActiveTab,
            allowFontScaling: true,
            style: {
                backgroundColor: Colors.primary,
                borderTopColor: Colors.borderColor
            }
        }}>
            <BottomTab.Screen name="Home" component={DrawerNavigation}
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
                    )
                }} />
        </BottomTab.Navigator>
    );
}

