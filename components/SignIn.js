import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

import { Context } from '../Authcontext';

import { Colors } from '../colors/Colors';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState(undefined);
    const [disabledButton, setDisabledButton] = useState(false);

    const { signIn } = useContext(Context);


    const SignInHandler = async () => {
        setDisabledButton(true);
        if (username == '' || password == '') {
            setErrMessage('Please fill all inputs');
            setDisabledButton(false);
            return;
        }
        if (errMessage != undefined) {
            setErrMessage(undefined);
        }
        const status = await signIn({ username, password });
        if (status) {
            setErrMessage(status.message);
            setDisabledButton(false);
        }

    }

    return (
        <View style={styles.loginForm}>
            <View>
                <Text style={styles.errorMessageText}>{errMessage}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email/Username"
                    value={username}
                    onChangeText={setUsername}
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
            <TouchableOpacity style={styles.signInButtonContainer} onPress={() => (SignInHandler())} disabled={disabledButton}>
                {
                    disabledButton == true ? <Text style={styles.signInText}>Loading ...</Text>
                        :
                        <Text style={styles.signInText}>Sign In</Text>

                }
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginForm: {
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
    signInButtonContainer: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 2
    },
    signInText: {
        color: '#fff',
        fontWeight: '700'
    }
})

export default SignIn;

