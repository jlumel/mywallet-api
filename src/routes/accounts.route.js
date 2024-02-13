import accountsController from '../controllers/accounts.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Accounts = router => {

    router.get('/accounts', requireAuth, accountsController.getAccounts)

    router.get('/accounts/:id', requireAuth, accountsController.getAccountById)

    router.post('/accounts/totals', requireAuth, accountsController.getTotals)

    router.post('/accounts', requireAuth, accountsController.createAccount)

    router.put('/accounts/:id', requireAuth, accountsController.modifyAccount)

    router.delete('/accounts/:id', requireAuth, accountsController.deleteAccount)
}

export default Accounts