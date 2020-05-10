const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.getUserName = functions.https.onCall(async (data, context) => {
    const postsQuery = data;
    const users = await admin.firestore().collection('users').get();

    users.forEach(doc => {
        postsQuery.forEach(post => {
            if (doc.data().userId == post.userId) {
                post.userName = doc.data().userName;
                post.photoURL = doc.data().photoURL;
            }
        })
    })
    return postsQuery;
});


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
            photoURL: ''
        }

        commentAuthorUsernameSnapshot.forEach(doc => {
            commentAuthor.userName = doc.data().userName;
            commentAuthor.photoURL = doc.data().photoURL;
        })

        const payload = {
            notification: {
                title: 'New Comment',
                body: `${commentAuthor.userName} commented on your post`,
                image: `${commentAuthor.photoURL}`
            }
        };

        const response = await admin.messaging().sendToDevice(tokensArray, payload);
        console.log('Send Push Notification', response);
        return response;
    })