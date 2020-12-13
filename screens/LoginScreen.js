import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import SignIn from '../components/SignIn';
import { Colors } from '../colors/Colors';

const LoginSreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={styles.loginView}>
                <Text style={styles.LoginText}>Log In</Text>
                <SignIn />
            </View>
            <View style={styles.registerButtonContainer}>
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Register Now >>></Text>
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
        width: '100%',
    },
    registerButton: {
        backgroundColor: Colors.primary,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    registerText: {
        color: '#fff',
        fontWeight: '700'
    }
})

export default LoginSreen;