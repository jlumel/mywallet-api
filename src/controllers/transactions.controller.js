import Transactions from "../models/Transactions.model.js"
import Accounts from "../models/accounts.model.js"

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
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    createTransaction: async (req, res) => {

        // create a transaction based on model and update user's balance

        const userId = req.session.user._id

        const { type, currencyAcronym, amount, accountName, categoryName, subCategoryName, description } = req.body

        if (type && currencyAcronym && amount && !isNaN(Number(amount)) && amount > 0 && accountName && categoryName && subCategoryName) {

            try {
                const account = await Accounts.findOne({ name: accountName })

                if (account.currencyAcronym != currencyAcronym) {
                    return res.status(400).json({ message: "This account uses a different currency" })
                }

                if (type == "debit" && account.balance < amount) {
                    return res.status(400).json({ message: "Insufficient funds" })
                }
            } catch (err) {
                return res.status(400).json({ error: "The transaction could not be added" })
            }

            const transaction = {
                type,
                userId,
                currencyAcronym,
                amount,
                accountName,
                categoryName,
                subCategoryName,
                description,
                timestamp: Date.now()
            }

            const newTransaction = new Transactions(transaction)

            newTransaction.save()
                .then(async () => {
                    try {
                        switch (type) {
                            case 'debit':
                                await Accounts.updateOne({ name: accountName }, { balance: balance - amount })
                                break;

                            case 'credit':
                                await Accounts.updateOne({ name: accountName }, { balance: balance + amount })
                                break;
                        }

                        res.status(201).json({ message: "Transaction created successfully" })

                    } catch (err) {
                        return res.status(500).json({ error: 'Internal server error' })
                    }

                })
                .catch(err => {
                    return res.status(400).json({ error: "The transaction could not be added" })
                })
        } else {
            return res.status(400).json({ message: "Information is missing" })
        }
    },
    modifyTransaction: async (req, res) => {

        // modify a given transaction information: get transaction id and information to modify. Allow to modify only one key at a time.

        const { id } = req.params

        const key = Object.keys(req.body)[0]
        const value = Object.values(req.body)[0]

        try {

            const transaction = await Transactions.findById(id)

            await Transactions.findOneAndUpdate({ _id: id }, { [key]: value })

            switch (key) {

                case "type":
                    if (value == 'debit') {
                        await Accounts.updateOne({ name: transaction.accountName }, { balance: balance - (transaction.amount * 2) })
                    } else {
                        await Accounts.updateOne({ name: transaction.accountName }, { balance: balance + (transaction.amount * 2) })
                    }
                    break;

                case "amount":
                    if (transaction.type == 'debit') {
                        await Accounts.updateOne({ name: transaction.accountName }, { balance: balance + transaction.amount - value })
                    } else {
                        await Accounts.updateOne({ name: transaction.accountName }, { balance: balance - transaction.amount + value })
                    }
                    break;
            }

            res.json({ message: "Transaction updated successfully" })

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }


    },
    deleteTransaction: async (req, res) => {

        // delete one transaction by its id

        const { id } = req.params

        try {

            const transaction = await Transactions.findOne({ _id: id })
            await Transactions.deleteOne({ _id: id })

            switch (transaction.type) {

                case 'debit':
                    await Accounts.updateOne({ name: transaction.accountName }, { balance: balance - transaction.amount })
                    break;

                case 'credit':
                    await Accounts.updateOne({ name: transaction.accountName }, { balance: balance + transaction.amount })
                    break;
            }

            res.json({ message: "Transaction deleted successfully" })

        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

export default transactionsController