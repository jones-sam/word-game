const functions = require("firebase-functions")
const { db, admin } = require("./util/admin")

// exports.deleteLeavingUser = functions.firestore
//   .document(`/lobbies/{doc}`)
//   .onWrite((change, context) => {
//     console.log(change.after.data())

//     db.doc(`/lobbies/${change.after.data().id}`).update({

//     })

//   })
