import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, AsyncStorage } from 'react-native';
import { Colors } from '../colors/Colors';
import NotificationCard from '../components/NotificationCard';
import { notifications, posts, postReactions, users } from '../firebaseInit';
import NoData from '../components/NoData';
const Notifications = props => {
    const [notificationsQuery, setNotificationsQuery] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getNotifications();
        subscribeSnapshot();

    }, [])

    const subscribeSnapshot = async () => {
        const uuid = await AsyncStorage.getItem('uuid');
        let i = 0;
        notifications.where('to', '==', uuid)
            .onSnapshot(() => {
                getNotifications();
            })

    }

    const getNotifications = async (snapshot = undefined) => {
        setRefresh(true)
        let notificationsSnapshot;
        if (snapshot) {
            notificationsSnapshot = snapshot;
        } else {
            const uuid = await AsyncStorage.getItem('uuid')
            notificationsSnapshot = await notifications.where('to', '==', uuid).get();
        }

        const notArray = [];
        notificationsSnapshot.forEach((doc) => {
            let obj = doc.data();
            obj.notId = doc.id;
            notArray.push(obj)
        })
        setNotificationsQuery(notArray);
        setRefresh(false)
    }

    const getPostDetails = async (item) => {
        setRefresh(true)
        const usersSnapshot = await users.where('userId', '==', item.to).get();
        const postSnap = await posts.doc(item.postId).get();
        const post = postSnap.data();
        post.postId = postSnap.id;
        const uuid = await AsyncStorage.getItem('uuid');
        const postReacts = await postReactions.where('postId', '==', item.postId).get();
        let counter = 0;
        postReacts.forEach((doc) => {
            post.count = ++counter;
            if (doc.data().userId === uuid) {
                post.react = doc.data().reaction;
                post.reactionUrl = doc.data().reactionUrl
                post.reactUserId = doc.data().userId;
            }
        })

        usersSnapshot.forEach((doc) => {
            post.userName = doc.data().userName;
            post.photoURL = doc.data().photoURL;

        })

        await notifications.doc(item.notId).update({
            seen: 1
        })
        setRefresh(false)
        props.navigation.navigate('PostDetails', { post: post })
    }

    const refreshHandler = () => {
        getNotifications();
    }


    return (
        <View style={styles.screen}>
            <FlatList
                data={notificationsQuery}
                renderItem={({ item }) => (
                    <NotificationCard photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} notification={item} postDetails={getPostDetails} />
                )}
                keyExtractor={item => item.notId}
                refreshing={refresh}
                onRefresh={refreshHandler}
                contentContainerStyle={notificationsQuery?.length === 0 && styles.emptyList}
                ListEmptyComponent={() => (<NoData text={'No Notifications Yet'} />)} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: Colors.backgroundPrimary
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Notifications;