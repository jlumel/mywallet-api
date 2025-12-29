import jwt from 'jsonwebtoken'

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        const jwToken = token.split(' ')[1]

        jwt.verify(jwToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid token'
                })
            } else {
                req.user = decoded
                next()
            }
        })

    } else {
        res.status(401).json({ isLogged: false, username: "", message: 'Unauthorized' })
    }
}

export default requireAuth