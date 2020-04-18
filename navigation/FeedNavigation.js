import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PostDetails from '../screens/PostDetails';
import AddPost from '../screens/AddPost';


const Feed = createStackNavigator();

export default function FeedNavigation() {
    return (
        <Feed.Navigator>
            <Feed.Screen name="Home" component={HomeScreen}  options={{ headerShown: false}}/>
            <Feed.Screen name="PostDetails" component={PostDetails} options={{ headerShown: false}} />
            <Feed.Screen name="AddPost" component={AddPost} options={{ headerShown: false}}  />
        </Feed.Navigator>
    );
}
