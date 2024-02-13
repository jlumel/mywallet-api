import currenciesController from '../controllers/currencies.controller.js'
import requireAuth from '../middleware/requireAuth.js'

const Currencies = router => {

    router.get('/currencies', requireAuth, currenciesController.getCurrencies)

    router.get('/currencies/:id', requireAuth, currenciesController.getCurrencyById)

    router.post('/currencies', requireAuth, currenciesController.createCurrency)

    router.put('/currencies/:id', requireAuth, currenciesController.modifyCurrency)

    router.delete('/currencies/:id', requireAuth, currenciesController.deleteCurrency)
}

export default Currencies