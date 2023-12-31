import Users from '../models/users.model.js'
import bcrypt from 'bcrypt'
import { logger } from '../service/logger.service.js'

const createHash = password => bcrypt.hashSync(password, 10)

const validatePassword = (dbPassword, password) => bcrypt.compareSync(password, dbPassword)

const userController = {

    registerUser: async (req, res) => {

        // Register User in DB

        const { username, password, password2 } = req.body
        try {
            const user = await Users.findOne({ username: username }).exec()

            if (user) {
                res.status(400).json({ error: 'User already exists' })
            } else if (username && password && password2) {
                if (password !== password2) {
                    return res.status(400).json({ error: 'Passwords do not match' })
                }
                const hash = createHash(password)
                const newUser = new Users({ username: username, password: hash })

                newUser.save()
                    .then(() => res.json({ message: "User registered correctly" }))
                    .catch(err => {
                        res.status(500).json({ error: "Internal server error" })
                    })

            } else {
                res.status(400).json({ message: 'All fields are required' })
            }
        } catch (err) {
            res.status(500).json({ error: "Internal server error" })
        }
    },
    loginUser: async (req, res) => {

        // Log in user and start session

        let { username, password } = req.body
        try {
            const user = await Users.findOne({ username: username }).exec()

            if (!user) {
                res.status(400).json({ error: 'User does not exist' })
            } else {
                if (!validatePassword(user.password, password)) {
                    res.status(403).json({ error: 'Invalid password' })
                } else {
                    req.session.user = user
                    logger.info(`${username} signed in`)
                    res.json({ isLogged: true, username })
                }
            }
        } catch (err) {
            res.status(500).json({ error: "Internal server error" })
        }
    },
    logoutUser: (req, res) => {

        // Log out and end session

        req.session.destroy(function (err) {
            if (err) {
                res.status(500).json({ error: "Internal server error" })
            } else {
                res.json({ message: "Logged out successfully" })
            }
        })
        logger.info("Logged out")

    },
    getSessionInfo: (req, res) => {

        if (req.session.user && req.session.user.username) {
            res.json({ isLogged: true, username: req.session.user.username })
        } else {
            res.json({ isLogged: false, username: "" })
        }
    },
    changePassword: async (req, res) => {

        const userId = req.session.user._id

        const newPassword = req.body.newPassword

        try {

            await Users.findOneAndUpdate({ _id: userId }, { password: createHash(newPassword) })

            res.json({ message: "Password updated successfully" })

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export default userController