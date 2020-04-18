import React, { useState, createContext, useMemo } from 'react';
import { AsyncStorage, Alert, View, Text, StyleSheet } from 'react-native';
import Header from './components/Header';
import LoginNavigation from './navigation/LoginNavigation';
import HomeNavigation from './navigation/HomeNavigation';

import { auth, users } from './firebaseInit'
export const Context = createContext();

const AuthContext = () => {
    const [signedIn, setSignedIn] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    React.useEffect(() => {
        updateStatusState();
    }, []);
    const authContext = useMemo(() => (
        {
            signIn: async data => {
                console.log(data)
                auth.signInWithEmailAndPassword(data.username, data.password)
                    .then(async (r) => {
                        try {
                            const token = await auth.currentUser.getIdToken();
                            await AsyncStorage.setItem('accessToken', token);
                            const uuid = auth.currentUser.uid;
                            await AsyncStorage.setItem('uuid', uuid);
                            updateStatusState();
                        }
                        catch (e) {
                            throw e;
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            },
            signOut: async () => {
                auth.signOut()
                    .then(async (r) => {
                        await AsyncStorage.removeItem('accessToken');
                        await AsyncStorage.removeItem('uuid');
                        updateStatusState();
                    })
            },

            signUp: async data => {
                auth.createUserWithEmailAndPassword(data.email, data.password)
                    .then(async (r) => {
                        try {
                            const user = auth.currentUser;
                            await users.add({
                                userId: user.uid,
                                photoURL: user.photoURL,
                                userName: data.username
                            });
                            const token = await user.getIdToken();
                            await AsyncStorage.setItem('accessToken', token);
                            const uuid = auth.currentUser.uid;
                            await AsyncStorage.setItem('uuid', uuid);
                            updateStatusState();
                        }
                        catch (e) {
                            console.log(e)
                        }
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

    return (
        <Context.Provider value={authContext}>
            {
                isLoading === true ? <View style={styles.loading}><Text style={styles.text}>Loading...</Text></View>
                    : signedIn === true ? <View style={{ flex: 1 }}>
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
        alignItems: 'center'
    },
    text: {
        fontSize: 24
    }
})

export default AuthContext
