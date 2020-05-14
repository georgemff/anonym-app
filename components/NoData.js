import React from 'react'
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../colors/Colors';
const NoData = props => {
    return (
        <View style={styles.NoDataScreen}>
            <Text style={styles.Text}>{props.text}</Text>
        </View>
    )
} 

const styles = StyleSheet.create({
    NoDataScreen: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems:'center'
    },
    Text: {
        fontSize: 22,
        color: 'rgba(0,0,0,0.1)',
        fontWeight: '900',
        color: Colors.textPrimary,
        opacity: 0.2
    }
})

export default NoData;