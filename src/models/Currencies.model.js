import mongoose from 'mongoose'

const Currencies = mongoose.model('Currencies', new mongoose.Schema(
    {
        name: {type:String, required: true},
        userId: {type:String, required: true},
        acronym: {type:String, required: true},
        symbol: {type:String, required: true}
    }
))

export default Currencies