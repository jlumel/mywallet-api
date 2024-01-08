import mongoose from 'mongoose'

const Accounts = mongoose.model('Accounts', new mongoose.Schema(
    {
        name: { type: String, required: true },
        userId: { type: String, required: true },
        currencyAcronym: { type: String, required: true },
    }
))

export default Accounts