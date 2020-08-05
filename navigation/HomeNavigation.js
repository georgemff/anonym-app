import React from 'react';
import DrawerNavigation from './DrawerNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import PostDetails from '../screens/PostDetails';
import AddPost from '../screens/AddPost';
import { Colors } from '../colors/Colors';
import BackButton from '../components/backButton';
import CreateCommunity from '../screens/CreateCommunity';
const Home = createStackNavigator();


export default function HomeNavigation() {
    return (
        <Home.Navigator>
            <Home.Screen options={{ headerShown: false }} name="Home" component={DrawerNavigation} />
            <Home.Screen options={{
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                title: 'Comments',
                headerTintColor: Colors.textPrimary,
                headerLeft: () => (
                    <BackButton />
                )
            }} name="PostDetails" component={PostDetails} />
            <Home.Screen
                options={{
                    headerStyle: {
                        backgroundColor: Colors.primary,
                    },
                    title: 'Create Post',
                    headerTintColor: Colors.textPrimary,
                    headerLeft: () => (
                        <BackButton />
                    )
                }} name="AddPost" component={AddPost} />
            <Home.Screen options={{
                headerStyle: {
                    backgroundColor: Colors.primary,
                },
                title: 'Create Community',
                headerTintColor: Colors.textPrimary,
                headerLeft: () => (
                    <BackButton />
                )
            }} name="CreateCommunity" component={CreateCommunity}
            />
        </Home.Navigator>
    );
}

