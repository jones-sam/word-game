const admin = require("firebase-admin")
const serviceAccount = require("./word-game-fff15-firebase-adminsdk-pczix-70b65fa5c1.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

module.exports = { admin, db }
