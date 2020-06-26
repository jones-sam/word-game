const functions = require("firebase-functions")
const { db, admin } = require("./util/admin")

// exports.deleteFinishedLobbies = functions.firestore
//   .document(`lobbies/{doc}`)
//   .onUpdate((change, context) => {

//       if (change.after.data().status === "finished") {
//           admin.firestore.delete(`${change.after.ref}/users`,{

//           })
//       }
//   })
