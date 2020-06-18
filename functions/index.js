const functions = require("firebase-functions")
const { db } = require("./util/admin")
const admin = require("./util/admin")

// exports.updateUserToLobby = functions.firestore
//   .document(`/users/{doc}`)
//   .onWrite((change, context) => {
//     console.log(change.after.data())
//     let lobbyID = change.after.data().lobbyID

//     db.doc(`/lobbies/${lobbyID}`).update({
//       users: admin.firestore.FieldValue.arrayUnion(change.after.data()),
//     })
//   })
