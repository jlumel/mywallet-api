import usersController from '../controllers/users.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Users = router => {

    router.post('/user/register', usersController.registerUser)

    router.post('/user/login', usersController.loginUser)

    router.post('/user/logout', requireAuth, usersController.logoutUser)

    router.get('/user', requireAuth, usersController.getSessionInfo)

    router.put('/user/password', requireAuth, usersController.changePassword)

    router.post('/user/firstLogin', requireAuth, usersController.firstLogin)
}

export default Users