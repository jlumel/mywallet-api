import currenciesController from '../controllers/currencies.controller.js'

const Currencies = router => {
    router.get('/categories', (req, res) => {
        currenciesController.getCurrencies(req, res)
    }),
    router.get('/categories/:id', (req, res) => {
        currenciesController.getCurrencyById(req, res)
    }),
    router.post('/categories', (req, res) => {
        currenciesController.createCurrency(req, res)
    }),
    router.put('/categories/:id', (req, res) => {
        currenciesController.modifyCurrency(req, res)
    }),
    router.delete('/categories/:id', (req, res) => {
        currenciesController.deleteCurrency(req, res)
    })
}

export default Currencies