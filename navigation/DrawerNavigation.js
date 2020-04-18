import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer'

import LogOut from '../components/LogOut';
import ProfileNavigation from './ProfileNavigation';


const Drawer = createDrawerNavigator();


export default function DrawerNavigation() {
    return (
        <Drawer.Navigator drawerPosition="right">
            <Drawer.Screen name="ProfileDraw" component={ProfileNavigation} />
            <Drawer.Screen name="Log Out" component={LogOut}/>
        </Drawer.Navigator>
    )
}
