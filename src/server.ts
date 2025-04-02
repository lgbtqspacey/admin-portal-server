import './tools/Sentry'
import * as sentry from '@sentry/node'
import * as dotenv from 'dotenv'
import express, { Application } from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { Sequelize } from 'sequelize-typescript'
import ErrorHandler from './middleware/ErrorHandler'
import { routes } from './router/routes'
import Log from './tools/Log'

dotenv.config({ path: '.env' })

const PORT = process.env.PORT ?? 3000
const app: Application = express()

routes(app)

// todo: remove
const client = new MongoClient(process.env.DB_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

const sequelize = new Sequelize({
    database: process.env.DB_NAME ?? '',
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    dialect: 'mssql',
    host: process.env.DB_HOST ?? '',
    models: [__dirname + './model']
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
        await sequelize.authenticate()
        Log.info('database', 'Database Connected')
    } catch (error) {
        await sequelize.close()
        Log.error('database', 'DB Connection', error)
    }
}

// todo: remove
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

export { collections, sequelize }

start()
connect()
