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
import { Icon } from 'react-native-elements';
import { posts, comments } from '../firebaseInit'
import { connect } from 'react-redux';
import { formatDate, updateAuthorUserName } from '../helpers/Helpers'
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';

const HomeScreen = (props) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const [postData, setPostData] = useState([]);
    const [postId, setPostId] = useState('');
    const [postView, setPostView] = useState('local');
 
    if (props.postView !== postView) {
        setPostView(props.postView);
    }

    useEffect(() => {
        if (props.postViewProp && postView !== props.postViewProp) {
            setPostView(props.postView.postView)
        }
        getPosts();
        return () => {

        }
    }, [postView]);

    const refreshHandler = () => {
        getPosts();
    }

    const getPosts = async () => {
        try {
            setRefresh(true);
            let queryData = [];
            const region = await AsyncStorage.getItem('region');
            let postsQuery;
            if (postView === 'local') {
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
                postView === 'local' ?
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
                data={postData}
                renderItem={({ item }) => (
                        <Card photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} postId={item.postId} author={item.userName} content={item.content} date={item.createdAt} />
                )}
                keyExtractor={item => item.postId}
                refreshing={refresh}
                onRefresh={refreshHandler}
                contentContainerStyle={postData?.length === 0 && styles.emptyList}
                ListEmptyComponent={() => (<NoData text={'No Posts Yet'} />)} />
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
        Test: "WTF",
        postView: state.postView.postView
    }
}


export default connect(mapStateToProps)(HomeScreen);