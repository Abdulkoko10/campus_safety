import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };


  // export const getToken = (setTokenFound) => {
  //   return getToken(messaging, {vapidKey: 'BHTGS64a81z80Wqwn14wMOZiH95KDBj8EgZ2CCSx2MXVsPd1-7vpqcaH6K_sefrLyDjGg1fthXrgj20KRVEjuGc'}).then((currentToken) => {
  //     if (currentToken) {
  //       console.log('current token for client: ', currentToken);
  //       setTokenFound(true);
  //       // Track the token -> client mapping, by sending to backend server
  //       // show on the UI that permission is secured
  //     } else {
  //       console.log('No registration token available. Request permission to generate one.');
  //       setTokenFound(false);
  //       // shows on the UI that permission is required 
  //     }
  //   }).catch((err) => {
  //     console.log('An error occurred while retrieving token. ', err);
  //     // catch error while creating client token
  //   });
  // }

  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

  const firebaseApp = initializeApp(firebaseConfig);
  const messaging = getMessaging(firebaseApp);

  // initializeApp(firebaseConfig);

  


export { getMessaging, getToken, onMessage, messaging};
  // export default firebase
  