import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, AsyncStorage, TouchableHighlight, Text, Keyboard } from 'react-native';

import PostCard from '../components/postCard';
import CommentCard from '../components/commentCard';
import { comments, queryComments, postReactions } from '../firebaseInit';
import { Colors } from '../colors/Colors';
import NoData from '../components/NoData';
import { updatePostView } from '../helpers/Helpers';

const PostDetails = ({ route, navigation }) => {
    navigation.setOptions({ tabBarVisible: false })
    const post = useRef(route.params.post)
    const [comment, setComment] = useState('');
    const [refresh, setRefresh] = useState(true);
    const [commentsData, setcommentsData] = useState([]);
    const [updatingComment, setUpdatingComment] = useState(false);
    const uuid = useRef(undefined);



    const addCommentHandler = async () => {
        try {
            if (comment == '') {
                return;
            }
            Keyboard.dismiss();
            const uuid = await AsyncStorage.getItem('uuid');
            comments.add({
                comment: comment,
                userId: uuid,
                postId: post.current.postId,
                createdAt: new Date().getTime()
            })
                .then(r => {
                    setComment('');
                })
        } catch (e) {
            console.log('addCommentHandler Error: ', e)
        }
    }

    const getComments = async () => {
        try {
            setRefresh(true);

            const updatedQueryData = await queryComments({ postId: post.current.postId });
            setcommentsData(updatedQueryData.data);
            setRefresh(false)
        } catch (e) {
            console.log('getComments Error: ', e)
        }


    }

    const refreshHandler = () => {
        getComments();
        getPostDetails();
    }

    const getPostDetails = async () => {

        try {
            postReactions.where('postId', '==', post.current.postId)
                .get()
                .then(snapshot => {
                    post.current.count = 0;
                    snapshot.forEach(doc => {
                        post.current.count = ++post.current.count;
                    })
                    console.log(post.current.count)
                })
        } catch (e) {
            console.log('getPostDetails Error: ', e);
        }
    }

    const updateSinglePost = (oldPost, react) => {

        try {
            setRefresh(true)

            const updatedData = updatePostView(oldPost, react, [oldPost], uuid.current);
            console.log('updated', updatedData)
            post.current = updatedData[0];

            setRefresh(false)
        } catch (e) {
            console.log('updateSinglePost Error: ', e)
        }
    }


    useEffect(() => {

        try {
            AsyncStorage.getItem('uuid')
                .then(id => {
                    uuid.current = id;
                    getComments();
                    getPostDetails();
                })
            
            const unsubscribe = comments
                .where("postId", "==", post.current.postId)
                .onSnapshot(() => {
                    getComments();
                });
                return () => {
                    unsubscribe();
                }
        } catch (e) {
            console.log('useEffect Error: ', e)
        }

        

    }, []);

    return (
        <View style={styles.screen}>
            <View style={styles.commentsSection}>
                <PostCard photoURL={post.current.photoURL ? post.current.photoURL : 'NoPhoto'} uuid={uuid.current} style={styles.postCard} updateSinglePost={updateSinglePost} post={post.current} postId={post.current.postId} />
                <FlatList
                    refreshing={refresh}
                    data={commentsData}
                    renderItem={({ item }) => (
                        <CommentCard photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} authorStyle={styles.commentAuthorStyle} author={item.userName} uuid={uuid.current} reactUserId={item.reactUserId} comment={item} commentId={item.commentId} content={item.comment} date={item.createdAt} />
                    )}
                    keyExtractor={item => item.commentId}
                    refreshing={refresh}
                    onRefresh={refreshHandler}
                    ListEmptyComponent={() => (<NoData text={'No Comments Yet'} />)}
                    contentContainerStyle={commentsData?.length === 0 && styles.emptyList}
                />
            </View>
            <View style={styles.addCommentContainer}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.commetInput} value={comment} onChangeText={setComment} placeholder="Write a comment..." placeholderTextColor={Colors.textPrimary} multiline={true} />
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
        backgroundColor: Colors.backgroundPrimary,
    },

    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postCard: {
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 20,
        borderRadius: 0,
        // marginHorizontal: 5 
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