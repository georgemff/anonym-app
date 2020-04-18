import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, AsyncStorage, TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Context } from '../Authcontext'
import { formatDate, updateAuthorUserName } from '../helpers/Helpers'
import { storageRef, auth, users, posts } from '../firebaseInit';

import Card from '../components/Card'

import { uriToBlob } from '../helpers/Helpers';
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';

import {DrawerActions} from '@react-navigation/native'


const ProfileScreen = ({ navigation }) => {
  const { signOut } = useContext(Context);
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);


  const getUserInfo = async () => {
    try {
      const uuid = await AsyncStorage.getItem('uuid');
      console.log(uuid, 'uuid')
      const userSnapshot = await users.where('userId', '==', uuid).get()
      let userData = {};
      userSnapshot.forEach((doc) => {
        userData = doc.data();
      });

      setUserInfo(userData);
    }
    catch (e) {
      console.log(e)
    }
  }

  const refreshHandler = () => {
    getUserComments();
  }


  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    getPermissionAsync();
    const uuid = await AsyncStorage.getItem('uuid');
    try {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
        .then(result => {
          if (!result.cancelled) {

            return uriToBlob(result.uri)
          }
        })
        .then(blob => {
          const metadata = {
            contentType: 'image/jpeg',
          };
          storageRef.child('avatars/' + uuid).put(blob, metadata)
            .then(async (snapshot) => {
              const downloadUrl = await snapshot.ref.getDownloadURL()
              console.log('userId', auth.currentUser.uid)
              console.log(uuid)
              users.where('userId', '==', uuid).get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    users.doc(doc.id).update({
                      photoURL: downloadUrl
                    })
                      .then(r => {
                        getUserInfo();
                        getUserComments();
                      })
                      .catch(e => {
                        console.log(e)
                      })
                  })
                })
                .catch(e => {
                  throw e;
                })
            })
        })

    } catch (E) {
      console.log(E);
    }
  };

  const getUserComments = async () => {
    setRefresh(true)
    const uuid = await AsyncStorage.getItem('uuid');

    try {
      const queryPosts = await posts.where('userId', '==', uuid)
        .get();

      let queryData = [];
      queryPosts.forEach((doc) => {
        let post = doc.data();
        post.createdAt = formatDate(post.createdAt)
        post.postId = doc.id;
        queryData.push(post);
      })
      queryData = await updateAuthorUserName(queryData);
      setUserPosts(queryData);
      setRefresh(false)
    }
    catch (e) {
      console.log(e)
    }
  }
  const getPostDetails = (item) => {
    navigation.navigate('PostDetails', { post: item })
  }

  const addPostNavigationHandler = () => {
    navigation.navigate('AddPost', { postAdd: getUserComments })
  }


  useEffect(() => {
    getUserInfo();
    getUserComments();
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={() => { _pickImage() }}>
          <Image source={{ uri: userInfo.photoURL }} style={{ height: 100, width: 100, borderRadius: 50, borderColor: '#fff', borderWidth: 2, backgroundColor: 'rgba(0,0,0,.1)' }} />
        </TouchableOpacity>
        <Text style={styles.userName}>
          {userInfo.userName}
        </Text>
      </View>
      <View>
      </View>
      <Button title="LogOut" onPress={() => (signOut())} />
      <View style={{ flex: 1 }}>
        {userPosts.length == 0 && !refresh ? <NoData text={'No Posts Yet'} /> :
          <FlatList
            data={userPosts}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { getPostDetails(item) }} activeOpacity={0.8}>
                <Card photoURL={item.photoURL} author={item.userName} content={item.content} date={item.createdAt} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.postId}
            refreshing={refresh}
            onRefresh={refreshHandler}
          />
        }
        <AddPostButton event={addPostNavigationHandler} />

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  wecolme: {
    fontSize: 22
  },
  profilePictureContainer: {
    paddingTop: 60,
    paddingBottom: 25,
    alignItems: 'center'
  },
  userName: {
    fontSize: 22,
    paddingTop: 12,
    letterSpacing: 0.5,
    fontWeight: '700'
  }
})

export default ProfileScreen;