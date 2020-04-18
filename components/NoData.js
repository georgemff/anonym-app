import React from 'react'
import {View, Text, StyleSheet} from 'react-native';

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
        justifyContent: 'center',
        alignItems:'center'
    },
    Text: {
        fontSize: 22,
        color: 'rgba(0,0,0,0.1)',
        fontWeight: '900'
    }
})

export default NoData;