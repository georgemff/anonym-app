import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import Register from '../components/Register';

const RegisterScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={styles.registerView}>
                <Text style={styles.registerText}>Register</Text>
                <Register />
            </View>
            <View style={styles.backToLoginButton}>
                <Button
                    title="Back to Log In"
                    onPress={() => navigation.navigate('Login')}
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
    registerView: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%'
    },
    registerText: {
        fontSize: 22
    },
    backToLoginButton: {
        flex: 2,
        width: '80%'
    }
})
export default RegisterScreen;