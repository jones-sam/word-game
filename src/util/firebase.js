import * as firebase from "firebase"

import firebaseConfig from "./firebaseConfig"

export const myFirebase = firebase.initializeApp(firebaseConfig)
myFirebase.analytics()

const baseDb = myFirebase.firestore()
export const db = baseDb

export const auth = myFirebase.auth()
