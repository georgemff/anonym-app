import React from 'react'
import { View, StyleSheet } from 'react-native';
import Textarea from '../components/Textarea';
import {Colors} from '../colors/Colors';
const AddPost = ({ route, navigation }) => {
    const {postAdd} = route.params; 

    const postAddHandler = () => {
        postAdd();
        navigation.goBack();
    }

    return (
        <View style={styles.screen}>
            <Textarea onPostAdd={postAddHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: Colors.backgroundPrimary,
        
    },
});

export default AddPost;