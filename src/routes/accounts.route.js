import accountsController from '../controllers/accounts.controller.js'

const Accounts = router => {
    router.get('/accounts', (req, res) => {
        accountsController.getAccounts(req, res)
    })
    router.get('/accounts/:id', (req, res) => {
        accountsController.getAccountById(req, res)
    })
    router.post('/accounts/totals', (req, res) => {
        accountsController.getTotalsByCurrency(req, res)
    }) 
    router.post('/accounts', (req, res) => {
        accountsController.createAccount(req, res)
    })
    router.put('/accounts/:id', (req, res) => {
        accountsController.modifyAccount(req, res)
    })
    router.delete('/accounts/:id', (req, res) => {
        accountsController.deleteAccount(req, res)
    })
}

export default Accounts