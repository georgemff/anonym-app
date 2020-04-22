import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { users } from '../firebaseInit';

import { Context } from '../Authcontext';

import { Colors } from '../colors/Colors';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp } = useContext(Context);
    const [errMessage, setErrMessage] = useState(undefined);
    const [disabledButton, setDisabledButton] = useState(false);

    const checkPasswords = async () => {
        setDisabledButton(true);
        if (errMessage != undefined) {
            setErrMessage(undefined);
        }
        if (!(await userNameAvailable())) {
            setErrMessage('Username Already Taken!');
            setDisabledButton(false);
            return;
        }
        if (password == confirmPassword && password != '') {
            const location = await getLocation();
            const status = await signUp({ username, email, location, password, confirmPassword });
            setErrMessage(status.message)
        } else {
            setErrMessage('Passwords Do Not Match')
        }
        setDisabledButton(false);

    }

    const userNameAvailable = async () => {
        const result = await users
            .where('userName', '==', username)
            .get();

        return result.empty;

    }



    const getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status == 'granted') {
            let location = await Location.getCurrentPositionAsync({});
            if (location) {
                let { latitude, longitude } = location.coords;
                const latLog = {
                    latitude,
                    longitude
                }
                let city = await Location.reverseGeocodeAsync(latLog);
                if (city) {
                    return city[0].city
                } else {
                    setErrMessage('Can Not Get City')
                }


            } else {
                setErrMessage('Can Not Get Location')
            }

        } else {
            setErrMessage('Location NOT Granted')
        }
        return '';

    }

    return (
        <View style={styles.registerForm}>
            <View>
                <Text style={styles.errorMessageText}>{errMessage}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.registerInButtonContainer} onPress={() => (checkPasswords())} disabled={disabledButton}>
                {
                    disabledButton == true ?
                        <Text style={styles.registerText}>Loading ...</Text>
                        :
                        <Text style={styles.registerText}>Register</Text>

                }
            </TouchableOpacity>
            {/* <Button title="Register" onPress={() => (checkPasswords())} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    registerForm: {
        width: '100%'
    },
    errorMessageText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12
    },
    inputContainer: {
        marginBottom: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    input: {
        padding: 5
    },
    registerInButtonContainer: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 2
    },
    registerText: {
        color: '#fff',
        fontWeight: '700'
    }
})

export default Register;

