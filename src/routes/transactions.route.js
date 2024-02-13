import transactionsController from '../controllers/transactions.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Transactions = router => {

    router.get('/transactions', requireAuth, transactionsController.getTransactions)

    router.get('/transactions/:id', requireAuth, transactionsController.getTransactionById)

    router.post('/transactions', requireAuth, transactionsController.createTransaction)

    router.put('/transactions/:id',  requireAuth, transactionsController.modifyTransaction)

    router.delete('/transactions/:id', requireAuth, transactionsController.deleteTransaction)
}

export default Transactions