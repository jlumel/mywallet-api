import MongoStore from 'connect-mongo'
import session from 'express-session'

const initSession = app => {
    
    app.use(session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL,
        }),
        secret: process.env.SECRET_KEY,
        cookie: { domain: '.onrender.com', sameSite: 'none', secure: true, maxAge: Number(process.env.SESSION_TTL) * 4 },
        resave: false,
        saveUninitialized: false
    }))
} 

export default initSession