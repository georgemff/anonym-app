import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
    TouchableHighlight,
    FlatList,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Modal
} from 'react-native';
import Card from '../components/Card';
import {Colors} from '../colors/Colors';

import { posts } from '../firebaseInit'

import { formatDate, updateAuthorUserName } from '../helpers/Helpers'
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';

const HomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [refresh, setRefresh] = useState(false);
    const [postData, setPostData] = useState([]);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        getPosts();
    }, []);

    const refreshHandler = () => {
        getPosts();
    }

    const getPosts = async () => {
        setRefresh(true);
        let queryData = [];
        const postsQuery = await posts.get();
        postsQuery.forEach((doc) => {
            let post = doc.data();
            post.createdAt = formatDate(post.createdAt)
            post.postId = doc.id;
            queryData.push(post);

        });
        queryData = await updateAuthorUserName(queryData);
        setPostData(queryData);
        setRefresh(false);
    }






    const showModal = async (id) => {
        // let userInfo = await AsyncStorage.getItem('user_info');
        // userInfo = JSON.parse(userInfo)
        // const { userId } = userInfo;
        // if (id == userId) {
        // setModalVisible(true)
        // 
        // }
    }

    const getPostDetails = (item) => {
        navigation.navigate('PostDetails', { post: item })
    }

    const addPostNavigationHandler = () => {
        navigation.navigate('AddPost', { postAdd: getPosts })
    }

    return (
        <View style={styles.screen}>
            {/* Modal Start */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure to delete this post?</Text>

                        <View style={styles.modalButtonContainer}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "red", width: 80 }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>No</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3", width: 80 }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Yes</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal End */}
            {postData.length == 0 && !refresh ? <NoData text={'No Posts Yet'} />:
            <FlatList
                data={postData}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { getPostDetails(item) }} activeOpacity={0.8} onLongPress={() => { showModal(item.userId) }}>
                        <Card photoURL={item.photoURL} author={item.userName} content={item.content} date={item.createdAt} />
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.postId}
                refreshing={refresh}
                onRefresh={refreshHandler} />
}
            <AddPostButton event={addPostNavigationHandler} />

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: 0,
        position: 'relative'

    },
    wecolme: {
        textAlign: 'center',
        fontSize: 22
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,

    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 3,
        padding: 35,
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
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 22
    },
    modalButtonContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
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