import './tools/Sentry'
import * as dotenv from 'dotenv'
import * as sentry from '@sentry/node'
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

const start = () => {
    try {
        sentry.setupExpressErrorHandler(app)
        app.use(ErrorHandler.httpErrorHandler)

        app.listen(PORT, () => {
            Log.info('application', `Running on port ${PORT}`)
        })
    } catch (error) {
        Log.error('application', 'Error starting application', error)
    }
}

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

const db = client.db('admin_portal')

const collections = {
    users: db.collection('users'),
    roles: db.collection('roles'),
    reports: db.collection('reports'),
    sessions: db.collection('sessions'),
    posts: db.collection('posts'),
    guides: db.collection('guides'),
    finances: db.collection('finances'),
    docs: db.collection('docs'),
    contracts: db.collection('contracts'),
}

export { collections }

start()
connect()
