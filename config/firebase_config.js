
var admin = require("firebase-admin");

var serviceAccount = require("../web-member-directory-firebase-adminsdk-k3swr-bf9b98c49f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseAuth = admin.auth();


module.exports = firebaseAuth;
