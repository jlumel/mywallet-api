import Users from '../models/Users.model.js'
import Accounts from '../models/Accounts.model.js'
import Categories from '../models/Categories.model.js'
import Subcategories from '../models/Subcategories.model.js'
import { logger, errorLog } from '../service/logger.service.js'
import { createHash, validatePassword } from '../utils.js'
import jwt from 'jsonwebtoken'

const userController = {

    registerUser: async (req, res) => {

        // Register User in DB

        const { username, password, password2 } = req.body
        try {
            const user = await Users.findOne({ username: username.toLowerCase() })

            if (user) {
                res.status(400).json({ message: 'User already exists' })
            } else if (username && password && password2) {
                if (password !== password2) {
                    return res.status(400).json({ message: 'Passwords do not match' })
                }
                const hash = createHash(password)
                const newUser = new Users({ username: username.toLowerCase(), password: hash })

                newUser.save()
                    .then(() => res.json({ message: "User registered correctly" }))
                    .catch(err => {
                        errorLog.error(err)
                        res.status(500).json({ error: "Internal server error" })
                    })

            } else {
                res.status(400).json({ message: 'All fields are required' })
            }
        } catch (err) {

            errorLog.error(err)
            res.status(500).json({ error: "Internal server error" })
        }
    },
    loginUser: async (req, res) => {

        // Log in user and start session

        let { username, password } = req.body
        try {
            const user = await Users.findOne({ username: username.toLowerCase() })

            if (!user) {
                res.status(400).json({ message: 'User does not exist' })
            } else {
                if (!validatePassword(user.password, password)) {
                    res.status(403).json({ message: 'Invalid password' })
                } else {
                    const token = jwt.sign({ password: createHash(password), ...user }, process.env.SECRET_KEY, { expiresIn: '4h' })
                    req.session.user = user
                    process.env.DEV_ENVIRONMENT && logger.info("Signed in")
                    res.json({ isLogged: true, username: username.toLowerCase(), token })
                }
            }
        } catch (err) {

            errorLog.error(err)
            res.status(500).json({ error: "Internal server error" })
        }
    },
    logoutUser: (req, res) => {

        // Log out and end session

        req.session.destroy(function (err) {
            if (err) {
                errorLog.error(err)
                res.status(500).json({ error: "Internal server error" })
            } else {
                res.json({ message: "Logged out successfully" })
            }
        })
        process.env.DEV_ENVIRONMENT && logger.info("Logged out")

    },
    getSessionInfo: (req, res) => {

        const token = req.headers.authorization

        if (req.session.user && req.session.user.username && token) {
            res.json({ isLogged: true, username: req.session.user.username })
        } else {
            const jwtToken = token.split(' ')[1]

            res.json({ isLogged: false, username: "", token: jwtToken })
        }
    },
    changePassword: async (req, res) => {

        const userId = req.session.user._id

        const newPassword = req.body.newPassword

        try {

            await Users.findOneAndUpdate({ _id: userId }, { password: createHash(newPassword) })

            res.json({ message: "Password updated successfully" })

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    firstLogin: async (req, res) => {
        const userId = req.session.user._id

        const { currencyAcronym } = req.body

        try {
            await new Accounts({ userId, name: "Cash", currencyAcronym }).save()

            await Categories.insertMany([
                { userId, name: "Services" }, { userId, name: "Salary" }, { userId, name: "Rent" }, { userId, name: "Public Transport" }, { userId, name: "Car" }, { userId, name: "Health" }, { userId, name: "Clothing" }, { userId, name: "Supermarket" }, { userId, name: "Credit card" }, { userId, name: "Food & Beverage" }, { userId, name: "Home" }, { userId, name: "Entertainment" }, { userId, name: "Sports" }, { userId, name: "Beauty & Self-Care" }, { userId, name: "Gifts" }, { userId, name: "Taxes" }, { userId, name: "Investment" }
            ])

            await Subcategories.insertMany([
                { userId, categoryName: "Services", name: "Electricity" }, { userId, categoryName: "Services", name: "Water" }, { userId, categoryName: "Services", name: "Gas" }, { userId, categoryName: "Services", name: "Mobile Line" }, { userId, categoryName: "Services", name: "Internet & Cable TV" }, { userId, categoryName: "Services", name: "Insurance" }, { userId, categoryName: "Car", name: "Fuel" }, { userId, categoryName: "Car", name: "Insurance" }, { userId, categoryName: "Health", name: "Farmacy" }, { userId, categoryName: "Food & Beverage", name: "Delivery" }, { userId, categoryName: "Food & Beverage", name: "Bars & Restaurants" }
            ])

            res.json({ message: "Default Wallet Items created successfully" })

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: "Internal server error" })
        }


    }
}

export default userController