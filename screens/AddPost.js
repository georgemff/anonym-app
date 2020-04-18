import React from 'react'
import { View, StyleSheet } from 'react-native';
import Textarea from '../components/Textarea';
const AddPost = ({ route, navigation }) => {
    const {postAdd} = route.params; 

    const postAddHandler = () => {
        postAdd();
        navigation.goBack();
    }

    return (
        <View>
            <Textarea onPostAdd={postAddHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
    },
});

export default AddPost;