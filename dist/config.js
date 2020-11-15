"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    server: {
        port: 8080,
        domain: "",
        protocol: "http"
    },
    mysql: {
        host: "us-cdbr-east-02.cleardb.com",
        port: "3306",
        user: "b4c93a290fd4bd",
        password: "4b57bfca",
        database: "heroku_2678020e15da692",
        connectionLimit: 100
    },
    redis: {
        host: "127.0.0.1",
        port: "6379",
        password: "",
        db: 0
    },
    authentication: {
        tokenLastTime: 31536000
    },
    firebase: {
        apiKey: "AIzaSyBsZpXV7_W4Zl94BL1cfFULqHAHJo4AGhA",
        authDomain: "hapokedex.firebaseapp.com",
        databaseURL: "https://hapokedex.firebaseio.com",
        projectId: "hapokedex",
        storageBucket: "hapokedex.appspot.com",
        messagingSenderId: "942847205164",
        appId: "1:942847205164:web:2ab1fd88ca56733e3fd689"
    }
};