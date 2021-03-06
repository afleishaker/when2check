import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const config = {
    apiKey: "AIzaSyBuTW_VaA5jLsAJDkik9I6ux9mi0oH4LRc",
    authDomain: "when-2-check.firebaseapp.com",
    databaseURL: "https://when-2-check.firebaseio.com",
    projectId: "when-2-check",
    storageBucket: "when-2-check.appspot.com",
    messagingSenderId: "953798775433",
    appId: "1:953798775433:web:fb17f973e237c786d16c58"
};

class Firebase {
    constructor(){
        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this.functions = firebase.functions();
        this.firestore = firebase.firestore();
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
    }

    // *** Functions API ***
    createEvent = (values) => {
        const createEvent = this.functions.httpsCallable("createEvent")
        createEvent(values).then(() => {
            console.log("Created event successfully", values)
        }).catch(err => {
            console.log("There was an error creating an event: ", err);
        });
    }

    // *** Auth API ***
    signInWithGoogle = () => {
        return this.auth.signInWithPopup(this.googleProvider);
    }

    addPhoneNumber = (phoneNumber) => {
       this.firestore.collection('users').doc(this.auth.currentUser.uid).set({
           phoneNumber
       }, { merge: true})
    }

    removeUserFromEvent = (eventID) => {
        const linksCollection = this.firestore.collection('links');
        linksCollection.doc(eventID).set({
            subscribers: firebase.firestore.FieldValue.arrayRemove(this.auth.currentUser.uid)
        })
    }

    signOut = () => this.auth.signOut();
}

export default Firebase;