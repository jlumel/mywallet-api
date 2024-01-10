import jwt from 'jsonwebtoken'

const requireAuth = (req, res, next) => {

    const token = req.headers.authorization

    if (req.session && req.session.user && token) {

        const jwToken = token.split(' ')[1]

        jwt.verify(jwToken, process.env.SECRET_KEY, (err, value) => {
            if (err) {
                res.status(403).send({
                    message: 'Invalid token'
                })
            } else {
                next()
            }
        })

    } else {
        res.status(401).json({ isLogged: false, username: "", message: 'Unauthorized' })
    }
}

export default requireAuth