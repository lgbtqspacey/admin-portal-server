import * as sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

sentry.init({
    enabled: false,
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    ignoreErrors: [
        /^E11000 duplicate key error collection/,
    ]
})
