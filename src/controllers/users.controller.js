import Users from '../models/users.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { logger } from '../service/logger.service.js'

const createHash = password => bcrypt.hashSync(password, 10)

const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

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
                const token = jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: `${Number(process.env.SESSION_TTL) / 1000}` })
                const hash = createHash(password)
                const newUser = new Users({ username: username, password: hash })

                newUser.save()
                    .then(() => res.json({ token }))
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
                if (!validatePassword(user, password)) {
                    res.status(403).json({ error: 'Invalid password' })
                } else {
                    const token = jwt.sign({ password: createHash(password), ...user }, process.env.JWT_SECRET, { expiresIn: process.env.SESSION_TTL })
                    logger.info(`${username} signed in`)
                    res.json({ token, username })
                }
            }
        } catch (err) {
            res.status(500).json({ error: "Internal server error" })
        }
    },
    logoutUser: (req, res) => {

        // Log out and end session

        res.json({ message: "Logged out successfully" })
    },
    isLogged: (req, res) => {

        if (req.user && req.user._doc.username) {
            res.json({ isLogged: true, username: req.user._doc.username })
        } else {
            res.json({ isLogged: false, username: "" })
        }
    },
    changePassword: async (req, res) => {

        const userId = req.user._doc._id

        const newPassword = req.body.newPassword

        try {

            await Users.findOneAndUpdate({ _id: userId }, {password: createHash(newPassword)}
            )

            res.json({ message: "Password updated successfully" })

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export default userController