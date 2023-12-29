import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import initApp from './service/initApp.service.js'
import initSession from './middleware/initSession.js'
import Users from './routes/users.route.js'
import verifyToken from './middleware/verifyToken.js'
import Transactions from './routes/transactions.route.js'
import Accounts from './routes/accounts.route.js'
import Currencies from './routes/currencies.route.js'
import Categories from './routes/categories.route.js'
import SubCategories from './routes/subcategories.route.js'
import cors from 'cors'

const app = express()
const router = express.Router()

//Middlewares

app.use(cors())
app.use(compression())
app.use(express.json())
app.use(cookieParser())
initSession(app)
app.use('/api', router)
router.use(verifyToken)

initApp(app)

// Routes

Users(app, router)
Transactions(router)
Accounts(router)
Currencies(router)
Categories(router)
SubCategories(router)