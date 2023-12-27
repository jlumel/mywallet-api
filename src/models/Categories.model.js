import mongoose from 'mongoose'

const Categories = mongoose.model('Categories', new mongoose.Schema(
    {
        name: {type:String, required: true},
        userId: {type:String}
    }
))

export default Categories