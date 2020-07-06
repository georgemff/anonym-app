import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export const formatDate = (millisecs) => {
  let date = new Date(millisecs)
  const hours = date.toLocaleTimeString()
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  if (dd < 10) { dd = '0' + dd }
  if (mm < 10) { mm = '0' + mm };
  return dd + '/' + mm + '/' + yyyy + ' ' + hours
}

export const uriToBlob = (uri) => {

  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };

    // this helps us get a blob
    xhr.responseType = 'blob';

    xhr.open('GET', uri, true);
    xhr.send(null);

  });

}

// export const updateAuthorUserName = async (queryPosts) => {
//   let updatedQuery = []
//   try {
//     updatedQuery = await getUserName(queryPosts);
//   } catch (e) {
//     console.log(e);
//   }
//   return updatedQuery;
// }

export const getLocation = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status == 'granted') {
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      let { latitude, longitude } = location.coords;
      const latLog = {
        latitude,
        longitude
      }
      let city = await Location.reverseGeocodeAsync(latLog);
      
      if (city) {
        return { 'city': city[0].city, 'region': city[0].region }
      } else {
        return 'Can Not Get City';
      }
    } else {
      return 'Can Not Get Location';
    }
  }

  return 'Location NOT Granted';

}


export const updatePostView = (post, react, postData, uuid) => {
     try{
      if(react.action === 0) {
        post.react = null;
        post.reactionUrl = null;
        post.reactUserId = null;
        post.count = --post.count;
    } else if (react.action === 1) {
        post.react = react.reaction;
        post.reactionUrl = react.reactionUrl;
    } else if(react.action === 2) {
        post.reactUserId =  uuid;
        post.reactionUrl = react.reactionUrl;
        post.react = react.reaction,
        post.count = post.count >= 0 ? ++post.count : 1
    }
    const copyData = Object.assign([], postData);
    for (let i = 0; i < copyData.length; i++) {
        if (copyData[i].postId == post.postId) {
            copyData[i] = post;
            break;
        }
    }

    return copyData;
     }catch(e) {
       console.log('uptadePostView Error: ', e)
     }
}