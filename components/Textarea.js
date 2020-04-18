import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, AsyncStorage } from 'react-native';
import {posts, users} from '../firebaseInit';
const TextArea = props => {
    const [post, setPost] = useState('');

    const addPostHandler = async () => {
        if(post == '') {
            return;
        }
        const uuid = await AsyncStorage.getItem('uuid');
        if(!uuid) {
            return;
        }
        posts
        .add({
            content: post,
            userId: uuid,
            createdAt: new Date().getTime()
        })
        .then(r => {
            setPost('');
            props.onPostAdd();
        })
        .catch(e => {
            console.log(e)
        })
    }
    return (
        <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput}
                autoFocus={true}
                multiline={true}
                numberOfLines={4}
                value={post}
                onChangeText={setPost}
                textAlignVertical="top"
                placeholder="Type Something..." />
            <Button title="Add Post" onPress={addPostHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    textInputContainer: {
        margin: 3,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 1,
        shadowOpacity: 0.10,
        backgroundColor: 'white',
        elevation: 1,
        borderRadius: 3
    },
    textInput: {
        padding: 5,
        paddingTop: 0,

    }
})

export default TextArea;