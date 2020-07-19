import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    FlatList,
    AsyncStorage,
    Modal
} from 'react-native';
import PostCard from '../components/postCard';
import { Colors } from '../colors/Colors';
import { Icon } from 'react-native-elements';
import { posts, comments, queryPosts, postReactions } from '../firebaseInit'
import { connect } from 'react-redux';
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';
import { updatePostView } from '../helpers/Helpers';

const HomeScreen = (props) => {
   
    const [modalVisible, setModalVisible] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const [postData, setPostData] = useState([]);
    const [postId, setPostId] = useState('');
    const [uuid, setUuid] = useState(undefined);
    const [updatingPost, setUpdatingPost] = useState(false);
    const postData1 = useRef(0)
    

    useEffect(() => {
        AsyncStorage.getItem('uuid')
            .then(id => {
                setUuid(id);
            })
        getPosts();
    }, [props.postView]);

    const refreshHandler = () => {
        getPosts();
    }

    const updateSinglePost = (post, react) => {

        try {
            setRefresh(true)
            
            const updatedData = updatePostView(post, react, postData1.current, uuid);
            postData1.current = [];
            postData1.current = updatedData;

            setUpdatingPost(!updatingPost)
            setRefresh(false)
        } catch (e) {
            console.log(e)
        }
    }

    const getPosts = async () => {
        try {
            setRefresh(true);
            const region = await AsyncStorage.getItem('region');
            const uuid = await AsyncStorage.getItem('uuid');
            const updatedQueryData = await queryPosts({ target: props.postView, region, uuid });
            // setPostData(updatedQueryData.data);
            postData1.current = updatedQueryData.data
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
        try {
            await posts.doc(postId).delete();
            const postRelatedCommentsSnapshot = await comments.where('postId', '==', postId).get();
            postRelatedCommentsSnapshot.forEach(doc => {
                doc.ref.delete();
            })
            getPosts();
            setModalVisible(false);
        } catch (e) {
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
            {
                props.postView === 'local' ?
                    <View style={styles.postViewAlert}>
                        <Icon name="place" size={20} color={Colors.textPrimary} />
                        <Text style={{ color: Colors.textPrimary, fontSize: 16, marginLeft: 5 }}>Local</Text>
                    </View>
                    :
                    <View style={styles.postViewAlert}>

                        <Icon name="public" size={20} color={Colors.textPrimary} />
                        <Text style={{ color: Colors.textPrimary, fontSize: 16, marginLeft: 5 }}>Global</Text>
                    </View>
            }
            <FlatList
                data={postData1.current}
                renderItem={({ item }) => (
                    <PostCard photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} uuid={uuid} postId={item.postId} updateSinglePost={updateSinglePost} postDetails={getPostDetails} post={item} />
                )}
                extraData={refresh}
                keyExtractor={item => item.postId}
                refreshing={refresh}
                onRefresh={refreshHandler}
                contentContainerStyle={postData1.current?.length === 0 && styles.emptyList}
                ListEmptyComponent={() => (<NoData text={'No Posts Yet'} />)}
                 />
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
    },
    postViewAlert: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: Colors.primary,
        marginTop: 5
    }
});

const mapStateToProps = (state) => {
    return {
        postView: state.postView.postView
    }
}


export default connect(mapStateToProps)(HomeScreen);