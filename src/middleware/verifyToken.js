import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || ""

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization
    if (!token) {
        res.status(401).json({
            error: 'Authorization header missing'
        })
    } else {
        const jwtToken = token.split(' ')[1]

        jwt.verify(jwtToken, jwtSecret, (err, value) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    return res.status(401).json({ message: "Token expired" })
                }
                res.status(403).json({
                    message: 'Invalid token'
                })
            } else {
                req.session.user = value._doc
                next()
            }
        })
    }
}

export default verifyToken