import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, PanResponder, Animated, AsyncStorage, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors, imageColors } from '../colors/Colors'
import { formatDate } from '../helpers/Helpers';

export const images = [
    { id: 'love', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Flove.png?alt=media&token=4870ac54-456e-4d6e-b9b4-1c71888775b9" },
    { id: 'haha', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Fhaha.png?alt=media&token=9cebaaa1-ef89-4f48-afbe-8bfc26340123" },
    { id: 'idc', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Fidc.png?alt=media&token=6943791b-e266-4093-bee9-f92192eed375" },
    { id: 'wow', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Fwow.png?alt=media&token=f50b6d9d-73ac-4b5f-99b9-52a56d42a783" },
    { id: 'sad', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Fsad.png?alt=media&token=b1a09d5f-7ecf-4db2-8b5b-87a73e59fe31" },
    { id: 'wtf', img: "https://firebasestorage.googleapis.com/v0/b/anonymapp-8e15d.appspot.com/o/reactions%2Fwtf.png?alt=media&token=b3ee121d-1a70-450e-ac81-93a47ed11958" }
]
import { postReactions } from '../firebaseInit';
const PostCard = props => {
    const [open, setOpen] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [popUp, setPopup] = useState(false);
    global._imgLayouts = {};
    global._scaleAnimation = new Animated.Value(0);
    global._imageAnimations = {};
    global._hoveredImg = '';
    global.openReactsInterval = undefined;

    images.forEach((img) => {
        _imageAnimations[img.id] = {
            position: new Animated.Value(1),
            scale: new Animated.Value(1)
        };
    })

    const pan = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: (evt, { gestureState }) => true,
        onStartShouldSetPanResponderCapture: (evt, { dx, dy }) => {
            return Math.abs(dx) < 20;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, getstureState) => {
            openReactsInterval = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(_scaleAnimation, {
                        duration: 100,
                        toValue: 1
                    }),
                    Animated.stagger(50, getImageAnimationArray(0))
                ]).start(() => { setOpen(true); setIsOpened(true) });
            }, 300)
        },
        onPanResponderMove: (evt, gestureState) => {
            if (Math.abs(gestureState.dy) > 150) {
                _hoveredImg = '';
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
        onPanResponderEnd: (evt, gestureState) => {
            try {
                clearTimeout(openReactsInterval);
                if (_hoveredImg) {
                    addReactionToPost(_hoveredImg);
                } else if (!isOpened) {
                    addReactionToPost();
                } else {
                    setOpen(false)
                    setIsOpened(false)
                }
            } catch (e) {
                console.log(e)
            }

        }
    })

    const [panResponder, setPanResponder] = useState(pan);

    useEffect(() => {
        setPanResponder(pan)
    }, [isOpened])

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
            left: position.nativeEvent.layout.x + 10,
            right: position.nativeEvent.layout.x + position.nativeEvent.layout.width + 10
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
                        ...{ width: 40, height: 40, borderRadius: 40, marginRight: 10, zIndex: 500 }, transform: [
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

    const addReactionToPost = async (hoveredImg = null) => {
        try {
            setOpen(false);
            setIsOpened(false);
            const userId = await AsyncStorage.getItem('uuid');
            const userHasReacted = props.post.reactUserId === userId;
            let reactionUrl = 'default';
            if (hoveredImg !== null) {
                reactionUrl = images.filter((img) => (
                    img.id === hoveredImg
                ))[0].img;
            }
            let alreadyReacted = false;
            if (userHasReacted) {
                if (props.post.react !== hoveredImg) {
                    if (hoveredImg == null) {
                        updateSinglePost({ reaction: null, reactionUrl: null, action: 0 });
                        postReactions
                            .where('userId', '==', userId)
                            .where('postId', '==', props.postId)
                            .get()
                            .then(snapshot => {
                                snapshot.forEach(doc => {
                                    doc.ref.delete();
                                })
                            })
                        alreadyReacted = true;
                    }
                    updateSinglePost({ reaction: hoveredImg, reactionUrl, action: 1 });
                    postReactions
                        .where('userId', '==', userId)
                        .where('postId', '==', props.postId)
                        .get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                doc.ref.update({
                                    reaction: hoveredImg,
                                    reactionUrl: reactionUrl
                                });
                            })
                        })
                    alreadyReacted = true;
                } else if (props.post.react === hoveredImg) {
                    alreadyReacted = true;
                }
            }

            if (alreadyReacted)
                return;

            if (hoveredImg == null) {
                hoveredImg = 'like';
            }

            updateSinglePost({ reaction: hoveredImg, reactionUrl, postId: props.postId, action: 2 });

            postReactions.add({
                postId: props.postId,
                userId: userId,
                reaction: hoveredImg,
                reactionUrl: reactionUrl
            })
                .then(() => {
                })
                .catch((e) => {
                    console.log(e)
                    updateSinglePost({ reaction: null, reactionUrl: null, action: 0 });
                })
        } catch (e) {
            console.log(e)
        }

    }

    const goToDetails = () => {
        props.postDetails(props.post);
    }

    const updateSinglePost = (react) => {
        props.updateSinglePost(props.post, react);
    }

    const getReactView = (uri, react) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: uri }} style={{ width: 16, height: 16, borderRadius: 40, marginRight: 5, zIndex: 500 }} />
                <Text style={{ color: react == 'love' ? 'red' : 'yellow' }}>{react.charAt(0).toUpperCase() + react.slice(1)}</Text>
            </View>
        )
    }

    const getUserReaction = () => {

        let reaction = undefined;

        for (let i in images) {
            if (images[i].id === props.post.react) {
                reaction = getReactView(images[i].img, images[i].id)
                break;
            }
        }

        if (React.isValidElement(reaction)) {
            return reaction;
        }
        else {
            return null;

        }
    }

    const getImageSize = (size) => {
        if (size) {
            return (parseInt(size) - (parseInt(size) * 0.03));
        }
        return 0
    }

    const dotsPressed = () => {
        setPopup(!popUp);
        props.showModal(props.post.userId, props.post.postId);
        console.log('pressed');
    }
    return (
        <TouchableOpacity activeOpacity={1} onPressOut={() => { setPopup(false) }}>
            <View style={styles.container} removeClippedSubviews={true} setClip>
                <View style={{ ...styles.card, ...props.style }}>
                    <View style={styles.authorImage}>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                imageColors.includes(props.post.photoURL) ?
                                    <View style={{ ...styles.image, backgroundColor: props.post.photoURL, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 22, color: Colors.textPrimary }}>{props.post.userName[0].toUpperCase()}</Text></View>
                                    :
                                    <Image source={{ uri: props.post.photoURL }} style={styles.image} />

                            }
                            <View>
                                <Text style={{ ...styles.author, ...props.authorStyle }}>{props.post.userName}</Text>
                                <View></View>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.date}>{formatDate(props.post.createdAt)}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={dotsPressed}>
                            <Icon name="dots-horizontal" type="material-community" color={Colors.textPrimary} size={25} />
                        </TouchableOpacity>

                        {/* {
                            popUp &&
                            <View style={styles.popUp}>
                                <TouchableOpacity><Text style={{ color: Colors.textPrimary }}>Delete</Text></TouchableOpacity>
                            </View>
                        } */}
                    </View>
                    <View>

                        <View style={styles.contentContainer}>
                            {
                                props.post.content ?
                                    <Text style={styles.postContent}>{props.post.content}</Text>
                                    : null
                            }
                            {
                                props.post.imageUrl ?
                                    <Image source={{ uri: props.post.imageUrl }} style={{ width: getImageSize(props.post.width), height: getImageSize(props.post.height), zIndex: -100 }} />
                                    : null
                            }
                        </View>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 7 }}>{
                    props.post.count > 0 ?
                        <Text style={{ color: Colors.date, fontSize: 12 }}>
                            {props.post.count} reactions
                </Text>
                        : null

                }
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ position: 'relative', flex: 1 }}>
                        <Animated.View {...panResponder.panHandlers} style={{ ...getLikeContainerStyle(), ...{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 500, paddingHorizontal: 7, paddingVertical: 10, } }} >
                            {
                                open &&
                                <View style={{ flexDirection: 'row', position: 'absolute', bottom: '150%', left: 10, zIndex: 500 }}>
                                    {getImages()}
                                </View>
                            }

                            {
                                props.post.reactUserId === props.uuid && getUserReaction() !== null ?
                                    getUserReaction()
                                    :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="like" type="evilicon" color={props.post.reactUserId === props.uuid ? Colors.activeTab : Colors.textPrimary} />
                                        <Text style={{ color: props.post.reactUserId === props.uuid ? Colors.activeTab : Colors.textPrimary }}>Like</Text>
                                    </View>

                            }

                        </Animated.View>
                    </View>
                    <TouchableOpacity style={{ paddingHorizontal: 7, paddingVertical: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={goToDetails}>
                        <Icon name="comment" type="evilicon" color={Colors.textPrimary} />
                        <Text style={{ color: Colors.textPrimary }}>Comment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.10,
        elevation: 0,
        marginTop: 5,
        position: 'relative',
    },
    card: {
        padding: 7,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
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
        color: Colors.textPrimary,
        marginBottom: 5
    },
    authorImage: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    popUp: {
        position: 'absolute',
        top: 19,
        right: 20,
        zIndex: 1111,
        width: 100,
        height: 80,
        padding: 7,
        backgroundColor: Colors.backgroundPrimary,
    }
});

export default PostCard;