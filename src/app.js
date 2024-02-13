import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import initApp from './service/initApp.service.js'
import Users from './routes/users.route.js'
import Transactions from './routes/transactions.route.js'
import Accounts from './routes/accounts.route.js'
import Currencies from './routes/currencies.route.js'
import Categories from './routes/categories.route.js'
import Subcategories from './routes/subcategories.route.js'
import cors from 'cors'
import initSession from './middleware/initSession.js'

const app = express()
const router = express.Router()

//Middlewares

app.disable("x-powered-by")
process.env.DEV_ENVIRONMENT ? app.use(cors({ credentials: true, origin: 'http://localhost:5173' })) :
    app.use(cors({ credentials: true, origin: 'https://mywallet.lumel.dev' }))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
initSession(app)
app.use('/api', router)

initApp(app)

// Routes

Users(router)
Transactions(router)
Accounts(router)
Currencies(router)
Categories(router)
Subcategories(router)