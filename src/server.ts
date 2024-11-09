import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb'
import ErrorHandler from './middleware/ErrorHandler'
import { routes } from './router/routes'
import Log from './tools/Log'

dotenv.config({ path: '.env' })

const PORT = process.env.PORT ?? 3000
const app: Application = express()

routes(app)

const client = new MongoClient(process.env.DB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

/**
 * Starts the application and bind middlewares.
 */
const start = () => {
    try {
        app.use(ErrorHandler.httpErrorHandler)

        app.listen(PORT, () => {
            Log.info('application', `Running on port ${PORT}`)
        })
    } catch (error) {
        Log.error('application', 'Error starting application', error)
    }
}

/**
 * Connects to the database.
 */
const connect = async () => {
    try {
        await client.connect()
        await client.db().command({ ping: 1 })
        Log.info('database', 'MongoDB Connected')
    } catch (error) {
        await client.close()
        Log.error('database', 'MongoDB Connection', error)
    }
}

const peopleDB = client.db('people')

/**
 * Declare databases and collections used in the application.
 * 
 * @template `collections.database.collection`
 * @example `collections.people.users`
 */
const collections = {
    people: {
        users: peopleDB.collection('users'),
        roles: peopleDB.collection('roles'),
        reports: peopleDB.collection('reports'),
    },
    auth: {
        sessions: peopleDB.collection('refresh_tokens'),
    }
}

export { collections }

start()
connect()
