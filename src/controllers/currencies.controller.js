import Currencies from '../models/Currencies.model.js'
import Transactions from '../models/Transactions.model.js'
import Accounts from '../models/Accounts.model.js'
import {errorLog} from '../service/logger.service.js'

const currenciesController = {

    getCurrencies: async (req, res) => {

        const userId = req.session.user._id

        try {
            const currencies = await Currencies.find({ userId }).exec()
            res.json(currencies)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getCurrencyById: async (req, res) => {

        const userId = req.session.user._id
        const { id } = req.params

        try {
            const currencies = await Currencies.find({ userId, _id: id }).exec()
            res.json(currencies)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    createCurrency: (req, res) => {

        const userId = req.session.user._id

        const { name, acronym, symbol } = req.body

        if (name && acronym && symbol) {

            const currency = {
                name,
                acronym,
                symbol,
                userId,
            }

            const newCurrency = new Currencies(currency)

            newCurrency.save()
                .then(async () => {

                    res.status(201).json({ message: "Currency created successfully" })
                })
                .catch(err => {
                    errorLog.error(err)
                    return res.status(400).json({ error: "The currency could not be created" })
                })
        } else {
            return res.status(400).json({ message: "All fields are required" })
        }

    },
    modifyCurrency: async (req, res) => {

        const { id } = req.params

        try {

            const oldCurrency = await Currencies.findOne({ _id: id })

            const currency = {}

            for (const key in req.body) {
                if (req.body[key]) {
                    currency[key] = req.body[key]
                }
            }
            await Currencies.findOneAndUpdate({ _id: id },
                {
                    $set: { ...currency }
                }
            )

            if (req.body.name) {

                await Transactions.updateMany({ userId: req.session.user._id, currencyName: oldCurrency.name }, { currencyName: req.body.name })
            }

            if (req.body.acronym) {

                await Transactions.updateMany({ userId: req.session.user._id, currencyAcronym: oldCurrency.acronym }, { currencyAcronym: req.body.acronym })

                await Accounts.updateMany({ userId: req.session.user._id, currencyAcronym: oldCurrency.acronym }, { currencyAcronym: req.body.acronym })
            }

            res.json({ message: "Currency updated successfully" })

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

    },
    deleteCurrency: async (req, res) => {

        const { id } = req.params
        const { acronym } = req.query

        try {
            const countTransactions = await Transactions.countDocuments({ currencyAcronym: acronym })
            if (countTransactions) {
                return res.status(400).json({ message: "The currency has related transactions. Delete them first to delete the currency" })
            }

            const countAccounts = await Accounts.countDocuments({ currencyAcronym: acronym })
            if (countAccounts) {
                return res.status(400).json({ message: "The currency has related accounts. Delete them first to delete the currency" })
            }

            try {
                await Currencies.deleteOne({ _id: id })

                res.json({ message: "Currency deleted successfully" })

            } catch (err) {
                errorLog.error(err)
                return res.status(500).json({ error: 'Internal server error' })
            }

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }

    }

}

export default currenciesController