import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
    TouchableHighlight,
    FlatList,
    AsyncStorage,
    TouchableOpacity,
    Modal
} from 'react-native';
import Card from '../components/Card';
import { Colors } from '../colors/Colors';

import { posts, comments } from '../firebaseInit'

import { formatDate, updateAuthorUserName } from '../helpers/Helpers'
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';

const HomeScreen = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const [postData, setPostData] = useState([]);
    const [postId, setPostId] = useState('');
    const [postView, setPostView] = useState('local');

    useEffect(() => {
        console.log(props.postViewProp)
        if(props.postViewProp && postView !== props.postViewProp) {
            setPostView(props.postViewProp)
        }
        getPosts();
        return () => {

        }
    }, [props.postViewProp]);

    const refreshHandler = () => {
        getPosts();
    }

    const getPosts = async () => {
        try {
            setRefresh(true);
            let queryData = [];
            const region = await AsyncStorage.getItem('region');
            let postsQuery;
            if(postView === 'local') {
                postsQuery = await posts.where('region', '==', region).orderBy('createdAt', 'desc').get();
            } else if (postView === 'global') {
                postsQuery = await posts.orderBy('createdAt', 'desc').get();
            }
            postsQuery?.forEach((doc) => {
                let post = doc.data();
                post.createdAt = formatDate(post.createdAt)
                post.postId = doc.id;
                queryData.push(post);
            });
            const updatedQueryData = await updateAuthorUserName(queryData);
            setPostData(updatedQueryData.data);
            setRefresh(false);
        } catch (e) {
            console.log(e)
        }
    }






    const showModal = async (userId, postId) => {
        const uuid = await AsyncStorage.getItem('uuid');
        if (userId == uuid) {
            setModalVisible(true);
            setPostId(postId)
        }
    }

    const deletePost = async () => {
        try{
            await posts.doc(postId).delete();
            const postRelatedCommentsSnapshot = await comments.where('postId', '==', postId).get();
            postRelatedCommentsSnapshot.forEach(doc => {
                doc.ref.delete();
            })
            getPosts();
            setModalVisible(false);
        } catch(e) {
            console.log(e)
        }
    }

    const getPostDetails = (item) => {
        props.navigation.navigate('PostDetails', { post: item })
    }

    const addPostNavigationHandler = () => {
        props.navigation.navigate('AddPost', { postAdd: getPosts })
    }

    return (
        <View style={styles.screen}>
            {/* Modal Start */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => (setModalVisible(false))}
                onPress={() => (setModalVisible(false))}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>You really want to delete this post?</Text>

                        <View style={styles.modalButtonContainer}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: Colors.danger, width: 80 }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Nope</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: Colors.buttomPrimary, width: 80 }}
                                onPress={deletePost}
                            >
                                <Text style={styles.textStyle}>Yup!</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal End */}
            {/* {(!postData || postData.length == 0) && !refresh ? <NoData text={'No Posts Yet'} /> : */}
                <FlatList
                    data={postData}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { getPostDetails(item) }} activeOpacity={0.8} onLongPress={() => { showModal(item.userId, item.postId) }}>
                            <Card photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} author={item.userName} content={item.content} date={item.createdAt} />
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.postId}
                    refreshing={refresh}
                    onRefresh={refreshHandler}
                    contentContainerStyle={postData?.length === 0 && styles.emptyList}
                    ListEmptyComponent={() => (<NoData text={'No Posts Yet'} />)} />
            {/* } */}
            <AddPostButton event={addPostNavigationHandler} />

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: 0,
        position: 'relative',
        backgroundColor: Colors.backgroundPrimary

    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wecolme: {
        textAlign: 'center',
        fontSize: 22
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22

    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        width: '90%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 3,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
        fontSize: 20,
        color: Colors.textPrimary
    },
    modalButtonContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'transparent'
    },
    addPostButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HomeScreen;