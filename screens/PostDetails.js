import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, AsyncStorage, TouchableHighlight, Text } from 'react-native';

import Card from '../components/Card';
import { comments } from '../firebaseInit';
import {Colors} from '../colors/Colors';
import { formatDate, updateAuthorUserName } from '../helpers/Helpers'
import NoData from '../components/NoData';

const PostDetails = ({ route, navigation }) => {
    navigation.setOptions({ tabBarVisible: false })
    const { post } = route.params;
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(true);
    const [commentsData, setcommentsData] = useState([]);



    const addCommentHandler = async () => {
        if (comment == '') {
            return;
        }
        const uuid = await AsyncStorage.getItem('uuid');
        comments.add({
            comment: comment,
            userId: uuid,
            postId: post.postId,
            createdAt: new Date().getTime()
        })
            .then(r => {
                setComment('');
            })
    }

    const getComments = async () => {
        setRefresh(true);
        const postComments = comments.where("postId", "==", post.postId).get();
        if ((await postComments).empty) {
            setRefresh(false);
            return;
        }
        const postQuery = await postComments;
        let queryData = []
        postQuery.forEach(function (doc) {
            let comment = doc.data();
            comment.commentId = doc.id;
            comment.createdAt = formatDate(comment.createdAt)
            queryData.push(comment);
        });

        const updatedQueryData = await updateAuthorUserName(queryData);
        setcommentsData(updatedQueryData.data);
        setRefresh(false)


    }

    const refreshHandler = () => {
        getComments()
    }

    useEffect(() => {
        getComments();
        const unsubscribe = comments
            .where("postId", "==", post.postId)
            .onSnapshot(async (querySnapshot) => {
                let queryData = [];
                querySnapshot.forEach(function (doc) {
                    let comment = doc.data();
                    comment.commentId = doc.id;
                    comment.createdAt = formatDate(comment.createdAt)
                    queryData.push(comment);
                });
                const updatedQueryData = await updateAuthorUserName(queryData);
                setcommentsData(updatedQueryData.data);
            });

        return () => {
            unsubscribe();
        }

    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.commentsSection}>
                <Card photoURL={post.photoURL} style={styles.postCard} author={post.userName} content={post.content} date={post.createdAt} />
                {commentsData.length == 0 && !refresh ? <NoData text={'No Comments Yet'} /> :
                    <FlatList
                        refreshing={refresh}
                        data={commentsData}
                        renderItem={({ item }) => (
                            <Card photoURL={item.photoURL} authorStyle={styles.commentAuthorStyle} author={item.userName} content={item.comment} date={item.createdAt} />
                        )}
                        keyExtractor={item => item.commentId}
                        refreshing={refresh}
                        onRefresh={refreshHandler}
                    />
                }
            </View>
            <View style={styles.addCommentContainer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.commetInput} value={comment} onChangeText={setComment} placeholder="Write a comment..." multiline={true} />
                </View>
                <View style={styles.addButtonContainer}>
                    <TouchableHighlight
                        style={{ ...styles.addCommentButton, backgroundColor: Colors.buttomPrimary }}
                        activeOpacity={1}
                        onPress={addCommentHandler}
                    >
                        <Text style={styles.textStyle}>Add</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: Colors.backgroundPrimary
    },
    postCard: {
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 20,
        borderRadius: 0,
        marginHorizontal: -3
    },
    commentsSection: {
        flex: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginBottom: 3,
        backgroundColor: Colors.backgroundPrimary

    },
    commentAuthorStyle: {
        fontSize: 16
    },
    addCommentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginHorizontal: 3,
        borderTopWidth: 1,
        borderTopColor: Colors.borderColor,
        borderRadius: 3,
        backgroundColor: 'transparent'

    },
    inputContainer: {
        flex: 1,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    commetInput: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: Colors.backgroundPrimary,
        color: Colors.textPrimary


    },
    addButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '101%',
        // marginTop: -1
    },
    addCommentButton: {
        backgroundColor: Colors.buttomPrimary,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 15,
        elevation: 2,
        height: '100%',
        marginTop: -1
    },
    textStyle: {
        color: Colors.textPrimary,
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default PostDetails;