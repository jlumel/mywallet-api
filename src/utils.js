import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, 10)

export const validatePassword = (dbPassword, password) => bcrypt.compareSync(password, dbPassword)