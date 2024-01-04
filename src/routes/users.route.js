import usersController from '../controllers/users.controller.js'


const Users = (app, router) => {

    app.post('/user/register', (req, res) => {
        usersController.registerUser(req, res)
    })

    router.post('/user/login', (req, res) => {
        usersController.loginUser(req, res)
    })

    router.post('/user/logout', (req, res) => {
        usersController.logoutUser(req, res)
    })

    router.get('/user', (req, res) => {
        usersController.getSessionInfo(req, res)
    })

    router.put('/user/password', (req, res) => {
        usersController.changePassword(req, res)
    })
}

export default Users