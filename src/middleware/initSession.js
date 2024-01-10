import MongoStore from 'connect-mongo'
import session from 'express-session'

const initSession = app => {

    app.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        }),
        secret: process.env.SECRET_KEY,
        cookie: !process.env.DEV_ENVIRONMENT ? { domain: '.lumel.dev', sameSite: 'none', secure: true, maxAge: Number(process.env.SESSION_TTL) * 4 } : { maxAge: Number(process.env.SESSION_TTL) * 4 },
        resave: false,
        saveUninitialized: false
    }))
}

export default initSession