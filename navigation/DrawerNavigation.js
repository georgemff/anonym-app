import React from 'react';
import { View, Text, ScrollView, Button, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer'
import { Icon } from 'react-native-elements';

import FeedNavigation from './FeedNavigation';
import { Colors } from '../colors/Colors';
import LogOutButton from '../components/LogOutButton'
import ExpandedButton from '../components/ExpandedButton';
const Drawer = createDrawerNavigator();


export default function DrawerNavigation() {
    return (
        <Drawer.Navigator
        initialRouteName="Home"
            drawerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.primary }}
            drawerContent={(props) => {
                return (
                    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
                        <SafeAreaView>
                            {/* <DrawerItemList {...props} /> */}
                            <ExpandedButton props={props} />
                        </SafeAreaView>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <LogOutButton />
                        </View>
                    </DrawerContentScrollView>
                )
            }} drawerType="back">
            <Drawer.Screen name="Home"
                options={{
                    drawerIcon: () =>
                        (<Icon name="home" size={24} color={Colors.activeTab} />)
                }}
                component={FeedNavigation} />
        </Drawer.Navigator>
    )
}
