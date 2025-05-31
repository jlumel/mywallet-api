import crypto from 'crypto'
import util from 'util'

const scrypt = util.promisify(crypto.scrypt)

export const createHash = async password => {
    const salt = crypto.randomBytes(16).toString("hex")
    const key = await scrypt(password, salt, 64)
    return `${salt}:${key.toString("hex")}`
}

export const validatePassword = async (dbPassword, password) => {
    const [salt, key] = dbPassword.split(":")
    const hashedBuffer = await scrypt(password, salt, 64)
    return key === hashedBuffer.toString("hex")
}