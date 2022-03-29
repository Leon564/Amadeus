var admin = require("firebase-admin");
var config=require('../config');

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(config.serviceAccount)),
    databaseURL: config.db
});

const db = admin.database();

module.exports = {
    db
}