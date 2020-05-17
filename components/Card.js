import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, PanResponder, Animated, AsyncStorage } from 'react-native';

import { Colors, imageColors } from '../colors/Colors';

export const images = [
    { id: 'like', img: 'http://i.imgur.com/LwCYmcM.gif' },
    { id: 'love', img: 'http://i.imgur.com/k5jMsaH.gif' },
    { id: 'haha', img: 'http://i.imgur.com/f93vCxM.gif' },
    { id: 'yay', img: 'http://i.imgur.com/a44ke8c.gif' },
    { id: 'wow', img: 'http://i.imgur.com/9xTkN93.gif' },
    { id: 'sad', img: 'http://i.imgur.com/tFOrN5d.gif' },
    { id: 'angry', img: 'http://i.imgur.com/1MgcQg0.gif' }
]
import { postReactions } from '../firebaseInit';
const Card = props => {
    const [selected, setSelected] = useState('');
    const [open, setOpen] = useState(false);
    global._imgLayouts = {};
    global._scaleAnimation = new Animated.Value(0);
    global._imageAnimations = {};
    global._hoveredImg = '';

    images.forEach((img) => {
        _imageAnimations[img.id] = {
            position: new Animated.Value(1),
            scale: new Animated.Value(1)
        };
    })
    const panResponder = React.useRef(
        PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, {gestureState}) => true,
            onStartShouldSetPanResponderCapture: (evt, {dx, dy}) =>
            {
                console.log(dx, dy)
                return Math.abs(dx) > 20;

            },
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                true,

            onPanResponderGrant: (evt, getstureState) => {
                Animated.parallel([
                    Animated.timing(_scaleAnimation, {
                        duration: 100,
                        toValue: 1
                    }),
                    Animated.stagger(50, getImageAnimationArray(0))
                ]).start(() => setOpen(true));
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log(gestureState.dy)
                if(Math.abs(gestureState.dy) > 150) {
                    setOpen(false)
                    return false;
                }
                const hoveredImg = getHoveredImg(Math.ceil(evt.nativeEvent.locationX));
                if (hoveredImg && _hoveredImg !== hoveredImg) {
                    animateSelected(_imageAnimations[hoveredImg])
                }
                if (_hoveredImg !== hoveredImg && _hoveredImg) {
                    animateFromSelect(_imageAnimations[_hoveredImg]);
                }
                _hoveredImg = hoveredImg;
            },
            onPanResponderTerminationRequest: (evt, gestureState) =>
                true,
            onPanResponderRelease: (evt, gestureState) => {
                console.log(_hoveredImg)
                if (_hoveredImg) {
                    addReactionToPost(_hoveredImg);
                }
                // setOpen(false)
            },
            onPanResponderEnd: (evt, gestureState) => {
                setOpen(false);
            }
        })
    ).current;

    const getHoveredImg = (x) => {
        return Object.keys(_imgLayouts).find((key) => {
            return x >= _imgLayouts[key].left && x <= _imgLayouts[key].right;
        })
    }
    const getImageAnimationArray = (toValue) => {
        return images.map((img) => {
            return Animated.timing(_imageAnimations[img.id].position, {
                duration: 200,
                toValue: toValue
            })
        });
    }
    const openReactions = () => {
        console.log('open')
        Animated.parallel([
            Animated.timing(_scaleAnimation, {
                duration: 100,
                toValue: 1
            }),
            Animated.stagger(50, getImageAnimationArray(0))
        ]).start(() => setOpen(true));
    }
    const close = (cb) => {
        this.setState({ open: false }, () => {
            Animated.stagger(100, [
                Animated.parallel(this.getImageAnimationArray(55, 0).reverse()),
                Animated.timing(_scaleAnimation, {
                    duration: 100,
                    toValue: 0
                })
            ]).start(cb);
        })
    }

    const animateSelected = (imgAnimations) => {
        Animated.parallel([
            Animated.timing(imgAnimations.position, {
                duration: 150,
                toValue: -10
            }),
            Animated.timing(imgAnimations.scale, {
                duration: 150,
                toValue: 1.2
            })
        ]).start();
    }
    const animateFromSelect = (imgAnimations, cb) => {
        Animated.parallel([
            Animated.timing(imgAnimations.position, {
                duration: 50,
                toValue: 0
            }),
            Animated.timing(imgAnimations.scale, {
                duration: 50,
                toValue: 1
            })
        ]).start(cb);
    }

    const handleLayoutPosition = (img, position) => {
        _imgLayouts[img] = {
            left: position.nativeEvent.layout.x,
            right: position.nativeEvent.layout.x + position.nativeEvent.layout.width
        }
    }

    const getImages = function () {
        return images.map((img) => {
            return (
                <Animated.Image
                    onLayout={handleLayoutPosition.bind(this, img.id)}
                    key={img.id}
                    source={{ uri: img.img }}
                    style={{
                        ...{ width: 40, height: 40, borderRadius: 40, marginRight: 5 }, transform: [
                            { scale: _imageAnimations[img.id].scale },
                            { translateY: _imageAnimations[img.id].position }
                        ]
                    }}
                />
            );
        })
    }

    const getLikeContainerStyle = () => {
        return {
            transform: [{ scaleY: _scaleAnimation }],
            overflow: open ? 'visible' : 'hidden',
        };
    }
    //Animation Code End

    const addReactionToPost = async (hoveredImg) => {
        console.log(hoveredImg)
        const userId = await AsyncStorage.getItem('uuid');
        const userHasReacted = await postReactions.where('userId', '==', userId).get();

        const reactionUrl = images.filter((img) => (
            img.id === hoveredImg
        ))[0].img;
        let updated = false;
        if(!userHasReacted.empty) {
            updated = userHasReacted.forEach(async (doc) => {
                if (doc.data().reaction === hoveredImg) {
                    await doc.ref.update({
                        reaction: hoveredImg,
                        reactionUrl: reactionUrl
                    })
                    return true;
                }
            })
        }
      
        console.log(updated)
        if(updated)
            return;

        postReactions.add({
            postId: props.postId,
            userId: userId,
            reaction: hoveredImg,
            reactionUrl: reactionUrl
        })
            .then(() => {
                console.log(true)
            })
            .catch((e) => {
                console.log(e)
            })

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
            <View style={{ paddingHorizontal: 7, paddingVertical: 15, position: 'relative' }}>
                <Animated.View {...panResponder.panHandlers} style={{ ...getLikeContainerStyle() }} >
                    {
                        open &&
                        <View style={{ flexDirection: 'row', position: 'absolute', bottom: '150%' }}>
                            {getImages()}
                        </View>
                    }
                    <Text style={{ color: Colors.textPrimary }}>React</Text>
                </Animated.View>
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
        marginTop: 5
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
});

export default Card;