import Transactions from "../models/Transactions.model.js"
import Accounts from "../models/Accounts.model.js"
import { errorLog } from '../service/logger.service.js'

const transactionsController = {

    getTransactions: async (req, res) => {

        // get all transactions from the user. Apply filters if queries are provided (Amount, type, min amount, max amount, category, subcategory, account, currency)

        const userId = req.session.user._id

        try {
            const query = { userId }

            if (req.query.amount) {
                query.amount = req.query.amount
            } else {
                if (req.query.minAmount) {
                    query.amount = { $gte: req.query.minAmount, ...query.amount }
                }
                if (req.query.maxAmount) {
                    query.amount = { $lte: req.query.maxAmount, ...query.amount }
                }
            }
            if (req.query.category) {
                query.category = req.query.category
            }
            if (req.query.subcategory) {
                query.subcategory = req.query.subcategory
            }
            if (req.query.accountName) {
                query.accountName = req.query.accountName
            }
            if (req.query.currency) {
                query.currency = req.query.currency
            }
            if (req.query.type) {
                query.type = req.query.type
            }

            const transactions = await Transactions.find(query).exec()
            res.json(transactions)

        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    getTransactionById: async (req, res) => {

        // get one transaction by id

        const userId = req.session.user._id
        const { id } = req.params
        console.log(userId, id)

        try {
            const transactions = await Transactions.find({ userId, _id: id }).exec()
            res.json(transactions)
        } catch (err) {
            errorLog.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    createTransaction: async (req, res) => {

        // create a transaction based on model

        const userId = req.session.user._id

        const { type, currencyAcronym, amount, accountName, categoryName, subcategoryName, description } = req.body

        if (type && currencyAcronym && amount && !isNaN(Number(amount)) && amount > 0 && accountName && categoryName) {

            try {
                const account = await Accounts.findOne({ name: accountName })

                if (account.currencyAcronym != currencyAcronym) {
                    return res.status(400).json({ message: "This account uses a different currency" })
                }

            } catch (err) {
                errorLog.error(err)
                return res.status(400).json({ error: "The transaction could not be added" })
            }

            const transaction = {
                type,
                userId,
                currencyAcronym,
                amount,
                accountName,
                categoryName,
                subcategoryName: subcategoryName ? subcategoryName : "",
                description: description ? description : "",
                timestamp: Date.now()
            }

            const newTransaction = new Transactions(transaction)

            try {

                await newTransaction.save()

                res.status(201).json({ message: "Transaction created successfully" })

            } catch (err) {
                errorLog.error(err)
                return res.status(400).json({ error: "The transaction could not be added" })
            }

        } else {
            return res.status(400).json({ message: "Information is missing" })
        }
    },
    modifyTransaction: async (req, res) => {

        // modify a given transaction information: get transaction id and information to modify

        const { id } = req.params

        try {

            const transaction = {}

            for (const key in req.body) {
                if (req.body[key]) {
                    transaction[key] = req.body[key]
                }
            }

            await Transactions.findOneAndUpdate({ _id: id },
                {
                    $set: { ...transaction }
                }
            )



            res.json({ message: "Transaction updated successfully" })

        } catch (err) {
            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    },
    deleteTransaction: async (req, res) => {

        // delete one transaction by its id

        const { id } = req.params

        try {

            await Transactions.deleteOne({ _id: id })

            res.json({ message: "Transaction deleted successfully" })

        } catch (err) {

            errorLog.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export default transactionsController