import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../colors/Colors'

const Header = props => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>A</Text>
            <Text style={{ ...styles.headerTitle, ...styles.p }}>Talk</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 40,
        paddingTop: 5,
        paddingLeft: 15,
        backgroundColor: Colors.primary,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary
    },
    p: {
        marginLeft: -1,
        color: Colors.textPrimary
    }
});

export default Header;