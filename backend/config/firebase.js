const admin = require('firebase-admin')
const configAccount = require('./config-firebase.json')

admin.initializeApp({
    credential: admin.credential.cert(configAccount),
    storageBucket: 'gs://nana-store-c5456.appspot.com'
})

const firestore = admin.firestore()

module.exports = { firestore, admin }