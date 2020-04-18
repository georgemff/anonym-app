import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

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
                    <Text>{props.content}</Text>
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
        marginHorizontal: 3,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 1,
        shadowOpacity: 0.10,
        backgroundColor: 'white',
        elevation: 1,
        borderRadius: 3
    },
    author: {
        fontSize: 18,
        fontWeight: '700'
    },
    date: {
        fontSize: 10,
        color: 'rgba(0,0,0,.3)'

    },
    contentContainer: {
        paddingVertical: 7
    },
    authorImage: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
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