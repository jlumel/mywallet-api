import accountsController from '../controllers/accounts.controller.js'

const Accounts = router => {
    router.get('/categories', (req, res) => {
        accountsController.getAccounts(req, res)
    }),
    router.get('/categories/:id', (req, res) => {
        accountsController.getAccountById(req, res)
    }),
    router.post('/categories', (req, res) => {
        accountsController.createAccount(req, res)
    }),
    router.put('/categories/:id', (req, res) => {
        accountsController.modifyAccount(req, res)
    }),
    router.delete('/categories/:id', (req, res) => {
        accountsController.deleteAccount(req, res)
    })
}

export default Accounts