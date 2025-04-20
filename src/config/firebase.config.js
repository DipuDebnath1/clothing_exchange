var admin = require("firebase-admin");

var serviceAccount = require("./newapp-a5412-firebase-adminsdk-fbsvc-ba8bca26de.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

 module.exports = admin