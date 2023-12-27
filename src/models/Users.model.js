import mongoose from 'mongoose'

const Users = mongoose.model('Users', new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    }
))

export default Users