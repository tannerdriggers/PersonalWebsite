const functions = require("firebase-functions");
const app = require("express")();



exports.api = functions.https.onRequest(app);
