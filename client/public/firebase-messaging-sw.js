// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCp9vRyhz03xSFu2b8iWm0BTHCd1M90TrQ",
  authDomain: "lucky-outpost-379107.firebaseapp.com",
  projectId: "lucky-outpost-379107",
  storageBucket: "lucky-outpost-379107.appspot.com",
  messagingSenderId: "181495106022",
  appId: "1:181495106022:web:99b7c0542a78ef0d6fee27",
  measurementId: "G-HKBSKP3ZKP"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Add the VAPID Key
// messaging.getToken({vapidKey: 'BHTGS64a81z80Wqwn14wMOZiH95KDBj8EgZ2CCSx2MXVsPd1-7vpqcaH6K_sefrLyDjGg1fthXrgj20KRVEjuGc'})
// .then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
