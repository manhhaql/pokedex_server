export default {
    server: {
        port: 3000,
        domain: "",
        protocol: "http"
    },
    mysql: {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "",
        database: "",
        connectionLimit: 100
    },
    firebase: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "leaftee",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
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
}