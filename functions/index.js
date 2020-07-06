const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.getUserName = functions.https.onCall(async (data, context) => {
//     const postsQuery = data;
//     const users = await admin.firestore().collection('users').get();

//     users.forEach(doc => {
//         postsQuery.forEach(post => {
//             if (doc.data().userId == post.userId) {
//                 post.userName = doc.data().userName;
//                 post.photoURL = doc.data().photoURL;
//             }
//         })
//     })
//     return postsQuery;
// });


exports.sendPushNotification = functions.firestore.document('comments/{commentId}')
    .onWrite(async (change, context) => {
        const afterUpdate = change.after.data();
        if (!afterUpdate) {
            console.log({ error: 400 })
            return {};
        }

        const tokensSnapShot = await admin.firestore().collection('notificationTokens').get();
        const currentPostCommentsSnapShot = await admin.firestore().collection('comments').where('postId', '==', afterUpdate.postId).get();
        const currentPostDoc = await admin.firestore().collection('posts').doc(afterUpdate.postId).get();
        const currentPostAuthorId = currentPostDoc.data().userId;
        const tokensSet = new Set();

        currentPostCommentsSnapShot.forEach(commentDoc => {
            tokensSnapShot.forEach(doc => {
                if (doc.data().userId !== undefined && (doc.data().userId === commentDoc.data().userId || doc.data().userId === currentPostAuthorId)) {
                    tokensSet.add(doc.data().notificationToken);
                }
            })
        })

        const tokensArray = Array.from(tokensSet);

        const commentAuthorUsernameSnapshot = await admin.firestore().collection('users').where('userId', '==', afterUpdate.userId).get();
        let commentAuthor = {
            userName: '',
            photoURL: '',
            fromUserId: ''
        }

        commentAuthorUsernameSnapshot.forEach(doc => {
            commentAuthor.userName = doc.data().userName;
            commentAuthor.photoURL = doc.data().photoURL;
            commentAuthor.fromUserId = doc.data().userId;
        })

        const payload = {
            notification: {
                title: 'New Comment',
                body: `${commentAuthor.userName} commented on your post`,
                image: `${commentAuthor.photoURL}`
            }
        };

        let response = null;
        if (tokensArray && tokensArray.length > 0) {
            response = await admin.messaging().sendToDevice(tokensArray, payload);
        }
        console.log('Send Push Notification', response);

        if (commentAuthor.fromUserId !== currentPostAuthorId) {
            await admin.firestore().collection('notifications').add({
                title: 'New Comment',
                body: `${commentAuthor.userName}`,
                photoURL: `${commentAuthor.photoURL}`,
                from: commentAuthor.fromUserId,
                to: currentPostAuthorId,
                postId: currentPostDoc.id,
                seen: 0
            })
        }
        return response;
    })

// exports.deletePostsAfterOneDay = functions.pubsub.schedule('5 11 * * *')
//     .timeZone('Georgia/Tbilisi')
//     .onRun((context) => {
//         const now = Date.now();
//         const cutoff = now - 24 * 60 * 60 * 1000;
//         const oldPostsRef = admin.firestore().collection('posts').orderBy('createdAt').endAt(cutoff).get();

//         oldPostsRef.then((snapShot) => {
//             snapShot.forEach(doc => {
//                 doc.ref.delete();
//             })
//         })
//     });

exports.queryPosts = functions.https.onCall(async (data, context) => {
    const { target, region, uuid } = data;
    const postsQuery = [];
    let postsQuerySnapshot = [];

    const users = await admin.firestore().collection('users').get();
    // const postsQuery = await getPosts(target, region);
    const postReactsSnapshot = await admin.firestore().collection('postReactions').get();
    if (target === 'local') {
        postsQuerySnapshot = await admin
            .firestore()
            .collection('posts')
            .where('region', '==', region)
            .orderBy('createdAt', 'desc').get();
    } else if (target === 'global') {
        postsQuerySnapshot = await admin.firestore().collection('posts').orderBy('createdAt', 'desc').get();
    }

    if (postsQuerySnapshot.empty) {
        return [];
    }

    postsQuerySnapshot.forEach((doc) => {
        let post = doc.data();
        post.postId = doc.id;
        postsQuery.push(post);
    });

    postsQuery.forEach(post => {
        let reactionCounter = 0;
        postReactsSnapshot.forEach(doc => {
            if (post.postId === doc.data().postId) {
                post.count = ++reactionCounter;

                if (doc.data().userId === uuid) {
                    post.react = doc.data().reaction;
                    post.reactionUrl = doc.data().reactionUrl
                    post.reactUserId = doc.data().userId;
                }
            }
        })
    })
    users.forEach(doc => {
        postsQuery.forEach(post => {
            if (doc.data().userId == post.userId) {
                post.userName = doc.data().userName;
                post.photoURL = doc.data().photoURL;
            }
        })
    })
    return postsQuery;
})


exports.queryComments = functions.https.onCall(async (data, context) => {
    const { postId } = data;
    const commentsQuery = [];
    const commentReactsSnapshot = await admin.firestore().collection('commentReactions').get();

    const users = await admin.firestore().collection('users').get();
    const commentsSnapshot = await admin.firestore().collection('comments')
        .where("postId", "==", postId)
        .orderBy("createdAt", "asc").get();

    if (commentsSnapshot.empty) {
        return [];
    }

    commentsSnapshot.forEach((doc) => {
        let comment = doc.data();
        comment.commentId = doc.id;
        commentsQuery.push(comment);
    });

    commentsQuery.forEach(comment => {
        commentReactsSnapshot.forEach(doc => {
            if (comment.commentId === doc.data().commentId) {
                comment.react = doc.data().reaction;
                comment.reactionUrl = doc.data().reactionUrl
                comment.reactUserId = doc.data().userId;
            }
        })
    })

    users.forEach(doc => {
        commentsQuery.forEach(comment => {
            if (doc.data().userId == comment.userId) {
                comment.userName = doc.data().userName;
                comment.photoURL = doc.data().photoURL;
            }
        })
    })
    return commentsQuery;
})


exports.queryUserPosts = functions.https.onCall(async (data, context) => {
    const { uuid } = data;
    const postsQuery = [];

    const users = await admin.firestore().collection('users').get();
    // const postsQuery = await getPosts(target, region);
    const postReactsSnapshot = await admin.firestore().collection('postReactions').get();
    const postsQuerySnapshot = await admin.firestore().collection('posts').where('userId', '==', uuid).orderBy('createdAt', 'desc').get();

    if (postsQuerySnapshot.empty) {
        return [];
    }

    postsQuerySnapshot.forEach((doc) => {
        let post = doc.data();
        post.postId = doc.id;
        postsQuery.push(post);
    });


    postsQuery.forEach(post => {
        postReactsSnapshot.forEach(doc => {
            if (post.postId === doc.data().postId) {
                post.react = doc.data().reaction;
                post.reactionUrl = doc.data().reactionUrl
                post.reactUserId = doc.data().userId;
            }
        })
    })
    users.forEach(doc => {
        postsQuery.forEach(post => {
            if (doc.data().userId == post.userId) {
                post.userName = doc.data().userName;
                post.photoURL = doc.data().photoURL;
            }
        })
    })
    return postsQuery;
})
