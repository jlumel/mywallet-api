import transactionsController from '../controllers/transactions.controller.js'

const Transactions = router => {
    router.get('/transactions', (req, res) => {
        transactionsController.getTransactions(req, res)
    }),
    router.get('/transactions/:id', (req, res) => {
        transactionsController.getTransactionById(req, res)
    }),
    router.post('/transactions', (req, res) => {
        transactionsController.createTransaction(req, res)
    }),
    router.put('/transactions/:id', (req, res) => {
        transactionsController.modifyTransaction(req, res)
    }),
    router.delete('/transactions/:id', (req, res) => {
        transactionsController.deleteTransaction(req, res)
    })
}

export default Transactions