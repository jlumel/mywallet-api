import { logger, errorLog } from './logger.service.js'
import db from '../DB/initDataBase.js'

const PORT =  process.env.PORT ?? 3001

const initApp = async app => {

    logger.info('Connecting to Database')

    try {

        await db

        logger.info('Database Connected')
        logger.info('Initializing Server...')
        const server = app.listen(PORT, () => {
            logger.info(`Server up at PORT ${PORT}`)
            process.env.DEV_ENVIRONMENT && logger.info('Dev environment')
        })

        server.on('error', error => {
            errorLog.error("Server connection failed")
            errorLog.error(error)
        })
    } catch (error) {

        errorLog.error("Database connection failed")
        errorLog.error(error)
    }
}


export default initApp