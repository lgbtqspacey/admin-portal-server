import express, { Application } from 'express'
import swaggerUi from 'swagger-ui-express'
import { authRouter } from './auth.routes'
import { adminRouter } from './admin.routes'
import * as swagger from './swagger.json'

const routes = (app: Application) => {
    app.use(
        express.json(),
        authRouter,
        adminRouter,
    )

    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swagger))
}

export { routes }
