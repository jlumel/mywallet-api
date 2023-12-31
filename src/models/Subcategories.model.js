import mongoose from 'mongoose'

const Subcategories = mongoose.model('Subcategories', new mongoose.Schema(
    {
        name: {type:String, required: true},
        userId: {type:String, required: true},
        categoryName: {type:String, required: true}
    }
))

export default Subcategories