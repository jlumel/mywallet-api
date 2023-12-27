import { logger, errorLog } from './logger.service.js'
import db from '../DB/initDataBase.js'

const PORT = process.env.PORT || 8080

const initApp = app => {

    logger.info('Connecting to Database')

    db
        .then(() => {
            logger.info('Database Connected')
            logger.info('Initializing Server...')
            const server = app.listen(PORT, () => {
                logger.info(`Server up at PORT ${PORT}`)
            })

            server.on('error', error => {
                errorLog.error("Server connection failed")
            })
        })
        .catch(err => errorLog.error("Database connection failed"))
}


export default initApp