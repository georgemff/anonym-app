import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

import Register from '../components/Register';

import {Colors} from '../colors/Colors';

const RegisterScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={styles.registerView}>
                <Text style={styles.registerText}>Register</Text>
                <Register />
            </View>
            <View style={styles.backToLoginButton}>
            <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLoginText}> Back to Log In</Text>
                </TouchableOpacity>
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
        width: '100%',
    },
    backToLogin: {
        backgroundColor: Colors.primary,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    backToLoginText: {
        color: '#fff',
        fontWeight: '700'
    }
})
export default RegisterScreen;