import express, { Application } from 'express'
import { authRouter } from './auth.routes'
import { adminRouter } from './admin.routes'

const routes = (app: Application) => {
    app.use(
        express.json(),
        authRouter,
        adminRouter,
    )
}

export { routes }
