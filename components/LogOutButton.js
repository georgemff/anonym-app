import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {Colors} from '../colors/Colors';

const LogOutButton = props => {

    return (
        <TouchableOpacity onPress={() => { props.event() }}
        style={{...styles.addPostButton, ...props.style}}>
        <Icon name="reply" color="#fff" size={30} />
    </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    addPostButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        backgroundColor: Colors.buttomPrimary,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default LogOutButton;