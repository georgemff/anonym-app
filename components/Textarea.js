import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Image, AsyncStorage, TouchableOpacity, Text } from 'react-native';
import { posts, storageRef } from '../firebaseInit';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../colors/Colors';
import { Icon } from 'react-native-elements';
import { uriToBlob } from '../helpers/Helpers';
const TextArea = props => {
    const [post, setPost] = useState('');
    const [imageUri, setIMageUri] = useState({ uri: '', width: 0, height: 0 })
    const imageUriRef = useRef({ uri: '', width: 0, height: 0 })
    const removeSelectedImage = () => {
        setIMageUri({ uri: '', width: 0, height: 0 });
        imageUriRef.current = { uri: '', width: 0, height: 0 }
    }
    const getUniqueMacroName = () => {
        let fileRand = new Date().getTime().toString();
        let fileRand1 = fileRand.substr(fileRand.length - 5);
        let fileRand2 = fileRand.substr(fileRand.length - 7);
        let fileRand3 = fileRand.substr(fileRand.length - 9);
        return fileRand1 + fileRand2 + fileRand3;
    }

    const _pickImage = async () => {
        // getPermissionAsync();
        try {
            ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            })
                .then(result => {
                    if (!result.cancelled) {
                        const dimensions = Dimensions.get('window')
                        const imageHeight = Math.round(dimensions.width * 9 / 16);
                        const imageWidth = dimensions.width;
                        setIMageUri({ uri: result.uri, width: imageWidth, height: imageHeight });
                        imageUriRef.current = { uri: result.uri, width: imageWidth, height: imageHeight };
                    }
                })
        } catch (E) {
            console.log(E);
        }
    };

    const uploadImage = async () => {
        try {
            let downloadUrl = '';
            const blob = await uriToBlob(imageUriRef.current.uri);
            const metadata = {
                contentType: 'image/jpeg',
            };
            const response = await storageRef.child('postImages/' + getUniqueMacroName()).put(blob, metadata);
            downloadUrl = await response.ref.getDownloadURL();
            return downloadUrl;
        } catch (e) {
            console.log(e)
        }
    }

    const addPostHandler = async () => {
        let downloadUrl = null;
        if (post == '' && imageUriRef.current.uri == '') {
            return;
        }
        if (imageUriRef.current.uri !== '') {
            downloadUrl = await uploadImage();
        }
        const uuid = await AsyncStorage.getItem('uuid');
        if (!uuid) {
            return;
        }
        posts
            .add({
                content: post,
                userId: uuid,
                createdAt: new Date().getTime(),
                region: await AsyncStorage.getItem('region'),
                imageUrl: downloadUrl,
                width: imageUriRef.current.width,
                height: imageUriRef.current.height
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
            <View style={{ position: 'relative', backgroundColor: Colors.primary, alignItems: 'center' }}>
                <TextInput
                    style={{ ...styles.textInput, fontSize: 18, width: '100%' }}
                    placeholder="Title"
                    placeholderTextColor={Colors.textPrimary} />
                <View style={{ borderBottomWidth: 0.3, borderBottomColor: Colors.textPrimary, width: '95%' }}></View>
            </View>
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
            <View style={styles.pickedImage}>
                {imageUri.uri ?
                    <TouchableOpacity style={styles.removeImage} onPress={removeSelectedImage}>
                        <Icon name="close" color={Colors.textPrimary} />
                    </TouchableOpacity>
                    : null
                }
                <Image source={{ uri: imageUri.uri }} style={{ width: imageUri.width, height: imageUri.height }} />
            </View>
            <View>
                <TouchableOpacity onPress={_pickImage} style={styles.imagePicker} activeOpacity={0.95}>
                    <Icon name="camera-alt" color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>
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
        backgroundColor: Colors.backgroundPrimary,
        elevation: 1,
        borderRadius: 3
    },
    textInput: {
        padding: 7,
        paddingLeft: 11,
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
    },
    imagePicker: {
        backgroundColor: Colors.primary,
        // width: 70,
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 7,
        justifyContent: "flex-start"
    },
    pickedImage: {
        position: 'relative'
    },
    removeImage: {
        position: 'absolute',
        zIndex: 111,
        right: 5,
        top: 5,
    }
})

export default TextArea;