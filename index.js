const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const session = require("express-session")
const cors = require('cors');

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    cors({
        origin: 'https://randompass-lemon.vercel.app',
        methods: "GET,HEAD,POST,DELETE",
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.use('/api/', require('./routes/route'))

connectDB();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port} and ${process.env.MONGO_URI}`);
});