import log4js from 'log4js'

log4js.configure({
    appenders: {
        error: {type: 'file', filename: './src/logs/error.log'},
        logger: {type: 'console'}
    },
    categories: {
        default: {appenders: ['logger'], level: 'info'},
        error: {appenders: ['error', 'logger'], level: 'error'}
    }
})

export const logger = log4js.getLogger()
export const errorLog = log4js.getLogger('error')