const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    storageBucket: 'gs://nana-store-c5456.appspot.com'
})

// admin.initializeApp({
//     credential: admin.credential.cert({
//         "type": "service_account",
//         "project_id": "nana-store-c5456",
//         "private_key_id": "00f02fc0587b5bb48180bba4a2250aaf742b32e9",
//         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZF5ed9dlSF89i\n9PxP1kkQgyoRdJ7/NiDhAU7rjfaCwiwS+zwJ/u99cDmUrzwkQyPm8IwKN5/NPn0Y\naAiSedWBfQwq7UtXOrv6Z5Su52p0Ny2v/lG9LbZp5eYR6BcntigDD6pD+EhaLjRl\nWtMtJQhuEdSYGggAu4mXU6NgBSsqbJJfNlBvfq48GV6qCpw51C9tSK7hRjhuB9Vb\n3IOFCdEhok/ndEMy+2+mBytRAtzrpjIif8U1OV3xOjIuZnkq2qnXVh2JEVCt+7N+\nPh+2knzzftZRL3qJdIQh7DiOiNo5XHddcwkgjXpJItB4qWsIB3Eys2RllrurLE1z\nuoWQyoeVAgMBAAECggEAB1l3BRGwwOI636Wql96JzH814K+bJTAe1QjXZ3F/0g88\nl1hRDbrHPqIBGQlrsFCWxqrUtHdyN5992nv4wLi5Y5ZceWTDybK2PXTdqD3Myuo5\nTj1+ZLitwpA8nzuSJejsgHOhA7pEL/79DOqSJQ03AViLyXbY8YMBb/f7Aah7IyCU\n3EGBpGjBz5CEfDmirx/sf6oQiBZ0G7H0IvhWs103225PHBHxwxZTSDby+jCns//T\nA65VNIPNqBbAOzXwI4EAjAm7IlfOqQABqWOkYR9F0jbMHAecphnz54YFsxV5NN3A\nxSx8ReStI+j0/Gc7AQEX+wzv9h/dvCeekMKC6FawoQKBgQD3vbIt5JxMf9NSa19L\nX2kTZFoD3uLF+0Ch9JpcrONKc/S0hBlLTmrT5V8p9UosKsy5InPbkKEzPkza0/nK\nfX2nbtRunOU55MeOePaAa0SHvq0fOjrcLjMyoJWsLC+xg+kPNHiwQX3C/vONjXUw\nn0MxYNfQkmtEfU95Btk5KdD5MQKBgQDgVFQumSVNMd5b6WkP2eAMH/1y80Zn2cAO\nEA4MVy9TzOqMK+ha1HthqgmhtoA+9NlysClZM37AURrJyGk6CCRQ4CBlSccPNFct\n5OE8LzPpMk09y8rr8y36w1tqNQGD6hTkflrWIimRxNNNPRPrjXVo7+a+wHChdu2m\neIB2G33bpQKBgDrmGZ95k4NIfJhCuMQ1qciXeiMjcWy6YFJg0fYokF0aFlp4cX8K\n5LD9/lL+YyT/A+8b9smDqB+Dt0frT57JmP8ehVjK6mCKOLtxnMFJP2C6f3RGJspE\nHZ3yucLWOnyMrPMVeYAGAf1DGepUcEEgDByINqb6uI/u7t8KNsi1XV5xAoGARzJ8\nhU2VySpKqGEsNxuvQCnnBtSvQ8aYbd4ql0AUhURELLjCxhEqF5Uf+XMywMh1OzEt\n7mGpmOAk4GX6/7AV1pVLstn3k5vJD4fU9IUGtLyCR1qmzLwhm7TlDpBEKtngR6TS\nr6OoDduqNJlt+RSsbuG1GlV5acWVJ4CXROT0zQECgYEA7eclPx6Vr7RJnTeJ22ti\nzpxb0CwjFS7MLX0t+gaNZGG0DgvoUkWK4OUtJB0aaGzsx5ohlvA++VYhKfqHgvuO\n8yAezs+sNKPihNrNW5caxaiNRtboT2S3DXNemreB1qPLpF9fLnfqJJj/6Rwu4ySK\nlFfSwD1AtsuR+mKH9T49UnY=\n-----END PRIVATE KEY-----\n",
//         "client_email": "firebase-adminsdk-lcq6u@nana-store-c5456.iam.gserviceaccount.com",
//         "client_id": "104908721410547541421",
//         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//         "token_uri": "https://oauth2.googleapis.com/token",
//         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lcq6u%40nana-store-c5456.iam.gserviceaccount.com",
//         "universe_domain": "googleapis.com"
//     }),
//     storageBucket: 'gs://nana-store-c5456.appspot.com'
// })

const firestore = admin.firestore()

module.exports = { firestore, admin }