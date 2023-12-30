import MongoStore from 'connect-mongo'
import session from 'express-session'

const initSession = app => {
    
    app.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        }),
        secret: process.env.JWT_SECRET,
        cookie: { maxAge: Number(process.env.SESSION_TTL) },
        resave: false,
        saveUninitialized: false
    }))
} 

export default initSession