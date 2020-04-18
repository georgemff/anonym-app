import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import SignIn from '../components/SignIn';

const LoginSreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={styles.loginView}>
                <Text style={styles.LoginText}>Log In</Text>
                <SignIn />
            </View>
            <View style={styles.registerButtonContainer}>
                <Button
                    title="Register"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginView: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%'
    },
    LoginText: {
        fontSize: 22
    },
    registerButtonContainer: {
        flex: 2,
        width: '80%'
    }
})

export default LoginSreen;