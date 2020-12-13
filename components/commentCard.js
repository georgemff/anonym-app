import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, imageColors } from '../colors/Colors';
import { formatDate } from '../helpers/Helpers';

const CommentCard = props => {


    return (
        <View style={styles.container}>
            <View style={{ ...styles.card, ...props.style }}>
                <View style={styles.authorImage}>
                    {
                        imageColors.includes(props.photoURL) ?
                            <View style={{ ...styles.image, backgroundColor: props.photoURL, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 22, color: Colors.textPrimary }}>{props.author[0].toUpperCase()}</Text></View>
                            :
                            <Image source={{ uri: props.photoURL }} style={styles.image} />
                    }
                </View>
                <View style={{ backgroundColor: Colors.primary, flex: 1, paddingLeft: 10, paddingVertical: 7, borderRadius: 15 }}>
                    <Text style={{ ...styles.author, ...props.authorStyle }}>{props.author}</Text>
                    <View style={styles.contentContainer}>
                        <Text style={styles.postContent}>{props.content}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingLeft: 51 }}>
                <View style={{ ...styles.dateContainer, flex: 1, paddingTop: 5 }}>
                    <Text style={styles.date}>{formatDate(props.date)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.10,
        elevation: 1,
        marginTop: 5,
    },
    card: {
        paddingLeft: 7,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: 0,
        shadowColor: 'black',
        shadowRadius: 1,
        borderRadius: 3,
    },
    author: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary
    },
    date: {
        fontSize: 10,
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
    },
});

export default CommentCard;