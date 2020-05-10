import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

import {Colors} from '../colors/Colors'

const Card = props => {
    return (
        <View style={{ ...styles.card, ...props.style }}>
            <View style={styles.authorImage}>
                <Image source={{ uri: props.photoURL }} style={styles.image} />
            </View>
            <View>
                <Text style={{ ...styles.author, ...props.authorStyle }}>{props.author}</Text>
                <View></View>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>{props.date}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.postContent}>{props.content}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 7,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 0,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 1,
        shadowOpacity: 0.10,
        backgroundColor: Colors.primary,
        elevation: 1,
        borderRadius: 3,
    },
    author: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary
    },
    date: {
        fontSize: 10,
        color: 'rgba(0,0,0,.3)',
        color: Colors.date

    },
    contentContainer: {
        paddingVertical: 7,
        color: Colors.textPrimary

    },
    postContent: {
        color: Colors.textPrimary
    },
    authorImage: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingTop: 7
    },
    image: {
         height: 40,
         width: 40,
         borderRadius: 20,
         backgroundColor: 'rgba(0,0,0,.1)',
         marginRight: 7
        }
});

export default Card;