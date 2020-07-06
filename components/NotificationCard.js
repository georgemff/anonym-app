import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, imageColors } from '../colors/Colors';

const NotificationCard = (props) => {

    

    const goToDetails = () => {
        props.postDetails(props.notification);
    }


    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={goToDetails}>
            <View style={styles.authorImage}>
                {
                    imageColors.includes(props.notification.photoURL) ?
                        <View style={{ ...styles.image, backgroundColor: props.notification.photoURL, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 22, color: Colors.textPrimary }}>{props.notification.body[0].toUpperCase()}</Text></View>
                        :
                        <Image source={{ uri: props.notification.photoURL }} style={styles.image} />

                }
            </View>
            <View style={{ paddingLeft: 7, justifyContent: 'center' }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{ color: Colors.textPrimary, fontSize: 18 }}>
                        {props.notification.body[0].toUpperCase() + props.notification.body.slice(1)}
                        <Text style={{ opacity: 0.1, color: 'rgba(215, 218, 220, 0.4)', fontSize: 17 }}> commented on your post</Text>
                    </Text>
                    {
                        props.notification.seen === 0 &&
                    <View style={{backgroundColor: Colors.activeTab, width: 15, height: 15, marginLeft: '15%', borderRadius: 8}}>
                        
                    </View>

                    }
                </View>
            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 7,
        marginBottom: 5
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
})

export default NotificationCard;