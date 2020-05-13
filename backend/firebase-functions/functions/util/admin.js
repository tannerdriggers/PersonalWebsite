var admin = require("firebase-admin");

var serviceAccount = require("../../../../serviceAccountKey.json");

let creds = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kratom-db.firebaseio.com",
};

admin.initializeApp(creds);

// admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };