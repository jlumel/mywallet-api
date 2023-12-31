const requireAuth = (req, res, next) => {

    if (req.session && req.session.user) {

        next()
    } else {
        res.status(401).json({ isLogged: false, username: "", message: 'Unauthorized' })
    }
}

export default requireAuth