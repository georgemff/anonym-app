import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, AsyncStorage, TouchableOpacity, Text } from 'react-native';
import { posts, users } from '../firebaseInit';
import {Colors} from '../colors/Colors';
const TextArea = props => {
    const [post, setPost] = useState('');

    const addPostHandler = async () => {
        if (post == '') {
            return;
        }
        const uuid = await AsyncStorage.getItem('uuid');
        if (!uuid) {
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
                minHeight={(Platform.OS === 'ios') ? (20 * 4) : null}
                value={post}
                onChangeText={setPost}
                textAlignVertical="top"
                placeholder="Type Something..."
                placeholderTextColor={Colors.textPrimary} />
            <TouchableOpacity style={styles.addPostButton} onPress={addPostHandler}>
                <Text style={styles.postButtonText}>Add Post</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputContainer: {
        marginTop: 5,
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
        backgroundColor: Colors.primary,
        color: 'white'
    },
    addPostButton: {
        height: 40,
        backgroundColor: Colors.buttomPrimary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postButtonText: {
        color: Colors.textPrimary,
        fontWeight: '700'
    }
})

export default TextArea;