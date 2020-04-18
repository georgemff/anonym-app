import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { Context } from '../Authcontext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp } = useContext(Context);
    const [errMessage, setErrMessage] = useState(undefined);

    const checkPasswords = async () => {

        if (password == confirmPassword) {
            const location = await getLocation();
            signUp({ username, email, location, password, confirmPassword });
        } else {
            setErrMessage('Passwords Do Not Match')
        }

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
                    console.log(city);
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
            <Button title="Register" onPress={() => (checkPasswords())} />
        </View>
    );
}

const styles = StyleSheet.create({
    registerForm: {
        width: '100%'
    },
    errorMessageText: {
        color: 'red',
        textAlign: 'center'
    },
    inputContainer: {
        marginBottom: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    input: {
        padding: 5
    }
})

export default Register;

