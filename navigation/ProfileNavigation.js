import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostDetails from '../screens/PostDetails';
import AddPost from '../screens/AddPost';
import ProfileScreen from '../screens/ProfileScreen';
import { Button } from 'react-native';


const Profile = createStackNavigator();

export default function ProfileNavigation() {
    return (
            <Profile.Navigator> 
                <Profile.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false}} />
                <Profile.Screen name="PostDetails" component={PostDetails} options={{ headerShown: false }} />
                <Profile.Screen name="AddPost" component={AddPost} options={{ headerShown: false }} />
            </Profile.Navigator>
    );
}
