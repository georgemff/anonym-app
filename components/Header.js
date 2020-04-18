import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Colors} from '../colors/Colors'

const Header = props => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>A</Text>
            <Text style={{ ...styles.headerTitle, ...styles.p }}>P</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 70,
        paddingTop: 30,
        paddingLeft: 20,
        backgroundColor: Colors.primary,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    headerTitle: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold'
    },
    p: {
        marginLeft: -5,
    }
});

export default Header;