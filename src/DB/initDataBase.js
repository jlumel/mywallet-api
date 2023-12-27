import mongoose from 'mongoose'

const db = mongoose.connect(process.env.MONGO_URL || '')

export default db