import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || ""

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(403).json({
            error: 'Authorization header missing'
        })
    } else {
        const jwtToken = token.split(' ')[1]

        jwt.verify(jwtToken, jwtSecret, (err, value) => {
            if (err) {
                res.status(403).json({
                    message: 'Invalid token'
                })
            } else {
                req.user = value
                next()
            }
        })
    }
}

export default verifyToken