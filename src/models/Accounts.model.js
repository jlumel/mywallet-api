import mongoose from 'mongoose'

const Accounts = mongoose.model('Accounts', new mongoose.Schema(
    {
        name: {type:String, required: true},
        userId: {type:String},
        currencyAcronym: {type:String, required: true},
        balance: {type:Number, required: true}
    }
))

export default Accounts