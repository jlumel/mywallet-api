import currenciesController from '../controllers/currencies.controller.js'

const Currencies = router => {
    router.get('/currencies', (req, res) => {
        currenciesController.getCurrencies(req, res)
    }),
    router.get('/currencies/:id', (req, res) => {
        currenciesController.getCurrencyById(req, res)
    }),
    router.post('/currencies', (req, res) => {
        currenciesController.createCurrency(req, res)
    }),
    router.put('/currencies/:id', (req, res) => {
        currenciesController.modifyCurrency(req, res)
    }),
    router.delete('/currencies/:id', (req, res) => {
        currenciesController.deleteCurrency(req, res)
    })
}

export default Currencies