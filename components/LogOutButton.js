import React, { useContext } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from '../colors/Colors';
import { Context } from '../Authcontext'

const LogOutButton = props => {
    const { signOut } = useContext(Context);

    return (
        <TouchableOpacity onPress={() => { signOut() }}
            style={{ ...styles.addPostButton, ...props.style }}>
            <Icon name="chevron-left" color={Colors.textPrimary} size={30} width={25} />
            <Text style={styles.LogOutText}>Log Out</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    addPostButton: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    LogOutText: {
        color: Colors.textPrimary,
        fontSize: 16,
        marginLeft: 10
    }
})

export default LogOutButton;