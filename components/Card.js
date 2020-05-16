import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Animated, LinearGradient, TouchableNativeFeedback } from 'react-native';

import { Colors, imageColors } from '../colors/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
const Card = props => {
    const [open, setOpen] = useState(false);
    // const url = 'http://i.imgur.com/k5jMsaH.gif';
    const images = [
        { id: 'like', img: 'http://i.imgur.com/LwCYmcM.gif' },
        { id: 'love', img: 'http://i.imgur.com/k5jMsaH.gif' },
        { id: 'haha', img: 'http://i.imgur.com/f93vCxM.gif' },
        { id: 'yay', img: 'http://i.imgur.com/a44ke8c.gif' },
        { id: 'wow', img: 'http://i.imgur.com/9xTkN93.gif' },
        { id: 'sad', img: 'http://i.imgur.com/tFOrN5d.gif' },
        { id: 'angry', img: 'http://i.imgur.com/1MgcQg0.gif' }
    ]

    const getImages = () => {
        return images.map((img, i) => {
            return (
                <View style={{marginRight: 5}}>
                    <TouchableNativeFeedback onPress={() => (reactChoosen(img.id))}>
                        <Image style={{...styles.pic,}}
                            source={{ uri: img.img }} />
                    </TouchableNativeFeedback>
                </View>
            )
        })
    }

    const reactChoosen = (id) => {
        console.log('reacted: ', id)
        setOpen(false)
    }

    const pressIn = () => {
        console.log('PressIn')
        setOpen(!open)
    }


    const shortPress = () => {
        if(open){
            setOpen(false);
            return;
        }
        console.log('short')
    }
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
            <View style={{paddingLeft: 7, paddingVertical: 10, position: 'relative'}}>
               {
                   open &&  <View style={{flexDirection: 'row', position: 'absolute', bottom: '150%', marginLeft: 5,  padding: 7, backgroundColor: Colors.primary, borderRadius: 40, borderWidth: 1, borderColor: Colors.date}}>
                   {open && getImages()}
               </View>
               }
                <TouchableOpacity onPress={shortPress}  onLongPress={pressIn}><Text style={{color: Colors.textPrimary, fontSize: 16}}>React</Text></TouchableOpacity>
            </View>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.10,
        elevation: 1,

    },
    card: {
        padding: 7,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 0,
        shadowColor: 'black',
        shadowRadius: 1,
        backgroundColor: Colors.primary,
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
    gradiet_out: {
        //zIndex: 1,
        //position: 'absolute',
        //elevation: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 225,
        borderWidth: 1,
        borderColor: '#ccc',
        //backgroundColor: "#fff"
        //transform: [{'translate':[0,0,1]}]
        //zIndex: 5
      },
      gradiet_in: {
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        borderColor: '#ccc',
        //zIndex: 5
      },
      pic: {
        resizeMode: 'cover',
        width: 30,
        height: 30
      },
});

export default Card;