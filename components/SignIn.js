import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

import { Context } from '../Authcontext';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(Context);

    return (
        <View style={styles.loginForm}>
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
            <Button title="Sign in" onPress={() => (signIn({ username, password }))} />
        </View>
    );
}

const styles = StyleSheet.create({
    loginForm: {
        width: '100%'
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

export default SignIn;

