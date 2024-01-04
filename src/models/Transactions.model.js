import mongoose from 'mongoose'

const Transactions = mongoose.model('Transactions', new mongoose.Schema(
    {
        type: { type: String, required: true },
        userId: { type: String, required: true },
        currencyAcronym: { type: String, required: true },
        amount: { type: Number, required: true },
        accountName: { type: String, required: true },
        categoryName: { type: String, required: true },
        subCategoryName: { type: String, default: "" },
        timestamp: { type: Number, required: true },
        description: { type: String, default: "" }
    }
))

export default Transactions