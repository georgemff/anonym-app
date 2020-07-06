import React, { useState, createContext, useMemo, useContext } from 'react';
import { AsyncStorage, View, Text, StyleSheet } from 'react-native';
import Header from './components/Header';
import LoginNavigation from './navigation/LoginNavigation';
import HomeNavigation from './navigation/HomeNavigation';
import * as Permissions from 'expo-permissions';
// import * as Notifications from 'expo-notifications';
import {Notifications} from 'expo';
import {imageColors} from './colors/Colors';
import { auth, users, notificationTokens } from './firebaseInit'
export const Context = createContext();


const AuthContext = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [senderId, setSenderId] = useState('779623741394');
    React.useEffect(() => {
        updateStatusState();
        return () => {

        }
    }, []);
    const randomInteger = () => {
        return Math.floor(Math.random() * (4 - 0 + 1)) + 0;
      }
    const authContext = useMemo(() => (
        {
            signIn: async data => {
                return auth.signInWithEmailAndPassword(data.username, data.password)
                    .then(async (r) => {
                        try {
                            const token = await auth.currentUser.getIdToken();
                            if (token) {
                                await AsyncStorage.setItem('accessToken', token);
                            }
                            const uuid = auth.currentUser.uid;
                            if (uuid) {
                                await AsyncStorage.setItem('uuid', uuid);
                                const userSnapshot = await users.where('userId', '==', uuid).get();
                                let user;
                                userSnapshot.forEach(doc => {
                                    user = doc.data();
                                });
                                if(user && user.region) {
                                await AsyncStorage.setItem('region', user.region);
                                }
                            }
                            let notificationPermission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                            if (notificationPermission != 'granted') {
                                notificationPermission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                            }
                            let deviceToken;
                            if (notificationPermission.granted) {
                                deviceToken = await Notifications.getDevicePushTokenAsync({gcmSenderId: senderId});
                                if(deviceToken && deviceToken.data) {
                                    saveDeviceToken(deviceToken);
                                }
                            }
                            updateStatusState();
                        }
                        catch (e) {
                            throw e;
                        }
                    })
                    .catch(e => {
                        return e;
                    })
            },
            signOut: async () => {
                auth.signOut()
                    .then(async (r) => {
                        const snapShot = await notificationTokens.where('userId', '==', await AsyncStorage.getItem('uuid')).get();
                        if (!snapShot.empty) {
                            snapShot.forEach(doc => {
                                notificationTokens.doc(doc.id)
                                    .delete()
                                    .then()
                                    .catch(e => {
                                        console.log(e);
                                    })
                            })
                        }
                        try{
                        await AsyncStorage.multiRemove(['accessToken', 'uuid', 'region'])
                        } catch(e) {
                            console.log(e)
                        }
                        updateStatusState();
                    })
            },

            signUp: async data => {
                return auth.createUserWithEmailAndPassword(data.email, data.password)
                    .then(async (r) => {
                        const user = auth.currentUser;
                        await users.add({
                            userId: user.uid,
                            photoURL: user.photoURL ? user.photoURL : imageColors[randomInteger()],
                            userName: data.username,
                            city: data.city,
                            region: data.region
                        });
                        const token = await user.getIdToken();
                        if (token) {
                            await AsyncStorage.setItem('accessToken', token);
                        }

                        const uuid = auth.currentUser.uid;
                        if (uuid) {
                            await AsyncStorage.setItem('uuid', uuid);
                        }

                        updateStatusState();
                    })
                    .catch(e => {
                        return e;
                    })
            }
        }
    ), [])


    const updateStatusState = async () => {
        setisLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        if (token == null) {
            setSignedIn(false);
        }
        else {
            setSignedIn(true);
        }
        setisLoading(false);
    }

    const saveDeviceToken = async (token) => {
        try {
            const uuid = await AsyncStorage.getItem('uuid');
            const notificationTokensDocRef = notificationTokens.where('userId', '==', uuid);
            notificationTokensDocRef
                .get()
                .then(async (snapShot) => {
                    if (snapShot.empty) {
                        notificationTokens.add({
                            userId: await AsyncStorage.getItem('uuid'),
                            type: token.type,
                            notificationToken: token.data
                        })
                    } else {
                        snapShot.forEach(doc => {
                            const notToken = doc.data().notificationToken;
                            if (notToken !== token) {
                                notificationTokens.doc(doc.id).update({
                                    notificationToken: token
                                })
                            }
                        })
                    }
                })
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Context.Provider value={authContext}>
            {
                isLoading === true ? <View style={styles.loading}><Text style={styles.text}>Loading...</Text></View>
                    : signedIn === true ? <View style={{ flex: 1, backgroundColor: '#030303' }}>
                        <Header title={'title'} />
                        <HomeNavigation />
                    </View>
                        : <LoginNavigation />}
        </Context.Provider>
    )

}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A1B'
    },
    text: {
        fontSize: 24,
        color: '#D7DADC'

    }
})

export default AuthContext