import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { formatDate, updateAuthorUserName, updatePostView } from '../helpers/Helpers'
import { storageRef, users, queryUserPosts, postReactions } from '../firebaseInit';
import { useFocusEffect } from '@react-navigation/native';


import PostCard from '../components/postCard';

import { uriToBlob } from '../helpers/Helpers';
import AddPostButton from '../components/AddPostButton';
import NoData from '../components/NoData';
import { Colors, imageColors } from '../colors/Colors';
import { ImagePropTypes } from 'react-native';


const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [drawer, setDrawer] = useState(true)
  const [uuid, setUuid] = useState(undefined);
  const userPosts1 = useRef(0)
  useFocusEffect(
    React.useCallback(() => {
      getUserPosts()
    }, [])
  )
  useEffect(() => {
    AsyncStorage.getItem('uuid')
    .then(id => setUuid(id))

    if (uuid) {
      getUserInfo();
      getUserPosts();
    }



  }, [uuid])



  const getUserInfo = async () => {
    try {
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
    getUserPosts();
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
              users.where('userId', '==', uuid).get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    users.doc(doc.id).update({
                      photoURL: downloadUrl
                    })
                      .then(r => {
                        getUserInfo();
                        getUserPosts();
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

  const getUserPosts = async () => {

    try {
      setRefresh(true)

      let uuid = await AsyncStorage.getItem('uuid');
      const updatedQueryData = await queryUserPosts({ uuid });

      userPosts1.current = updatedQueryData.data; 
      setRefresh(false)
    }
    catch (e) {
      console.log(e)
    }
  }

  const updateSinglePost = (post, react) => {

    try {
        setRefresh(true)
        
        const updatedData = updatePostView(post, react, userPosts1.current, uuid);
        userPosts1.current = [];
        userPosts1.current = updatedData;

        setRefresh(false)
    } catch (e) {
        console.log(e)
    }
}


  const getPostDetails = (item) => {
    navigation.navigate('PostDetails', { post: item })
  }

  const addPostNavigationHandler = () => {
    navigation.navigate('AddPost', { postAdd: getUserPosts })
  }

  return (
    <View style={styles.screen}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={() => { _pickImage() }}>
          {
            imageColors.includes(userInfo.photoURL) ?
              <View style={{ ...styles.profilePicture, backgroundColor: userInfo.photoURL, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Colors.textPrimary, fontSize: 38 }}>{userInfo.userName[0].toUpperCase()}</Text>
              </View>
              :
              <Image source={{ uri: userInfo.photoURL ? userInfo.photoURL : 'NoPhoto' }} style={styles.profilePicture} />

          }
        </TouchableOpacity>
        <Text style={styles.userName}>
          {userInfo.userName}
        </Text>
      </View>
      <View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={userPosts1.current}
          renderItem={({ item }) => (
            <PostCard photoURL={item.photoURL ? item.photoURL : 'NoPhoto'} uuid={uuid} postId={item.postId} count={item.count} reactUserId={item.reactUserId} author={item.userName} content={item.content} date={item.createdAt} postDetails={getPostDetails} updateSinglePost={updateSinglePost} post={item} />
          )}
          keyExtractor={item => item.postId}
          refreshing={refresh}
          onRefresh={refreshHandler}
          contentContainerStyle={userPosts1.current?.length === 0 && styles.emptyList}
          ListEmptyComponent={() => (<NoData text={'No Posts Yet'} />)}
        />
        <AddPostButton style={{ right: '5%' }} event={addPostNavigationHandler} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary

  },

  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wecolme: {
    fontSize: 22
  },
  profilePictureContainer: {
    paddingTop: '10%',
    paddingBottom: '5%',
    alignItems: 'center'
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  userName: {
    fontSize: 22,
    paddingTop: 12,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  logOutButton: {
    height: 40,
    backgroundColor: Colors.buttomPrimary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logOutButtonText: {
    color: Colors.textPrimary,
    fontWeight: '700'
  }
})

export default ProfileScreen;