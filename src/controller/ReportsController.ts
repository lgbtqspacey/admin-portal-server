import { NextFunction, Request, Response } from 'express'
import { collections } from '../server'
import { httpStatus, reqData } from '../tools/Constants'
import { InternalServerError, NotFound } from '../tools/Error'
import { getDataFromPreviousMiddleware } from '../tools/Helpers'
import Log from '../tools/Log'

export default class ReportsController {
    /**
     * Creates a new report.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `InternalServerError` If the report is not created.
     */
    public static readonly createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const report = getDataFromPreviousMiddleware(reqData.reportCreate, req, next)

            const result = await collections.people.reports.insertOne(report)

            if (result) {
                res.status(httpStatus.created).send(result)
            } else {
                next(new InternalServerError())
                next()
            }

            Log.info('controller', 'ReportsController :: Calling Endpoint :: CreateReport')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'ReportsController :: Calling Endpoint :: CreateReport'
            next(error)
        }
    }

    /**
     * Gets all reports from a user.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `InternalServerError` If the reports cannot be retrieved.
     */
    public static readonly getReportsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filterReports, req, next)
            const page = getDataFromPreviousMiddleware(reqData.page, req, next)
            const limit = getDataFromPreviousMiddleware(reqData.limit, req, next)

            const result = await collections.people.reports.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray()

            if (result) {
                res.status(httpStatus.ok).send({
                    count: result.length,
                    page: page,
                    limit: limit,
                    reports: result
                })
            } else {
                next(new InternalServerError())
                next()
            }
            Log.info('controller', 'ReportsController :: Calling Endpoint :: GetReportsByUser')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'ReportsController :: Calling Endpoint :: GetReportsByUser'
            next(error)
        }
    }

    /**
     * Updates a single existing report.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `NotFound` If the report is not found.
     */
    public static readonly updateReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)
            const update = getDataFromPreviousMiddleware(reqData.reportUpdate, req, next)

            const result = await collections.people.reports.findOneAndUpdate(filter, update, { returnDocument: 'after' })

            if (result) {
                res.status(httpStatus.ok).send(result)
            } else {
                next(new NotFound())
                next()
            }

            Log.info('controller', 'ReportsController :: Calling Endpoint :: UpdateReport')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'ReportsController :: Calling Endpoint :: UpdateReport'
            next(error)
        }
    }

    /**
     * Deletes a single report.
     * 
     * @see `ValidateRequest.ts` for validation rules.
     * @throws `NotFound` If the report is not found.
     */
    public static readonly deleteReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filter = getDataFromPreviousMiddleware(reqData.filter, req, next)

            const result = await collections.people.reports.deleteOne(filter)

            if (result?.deletedCount) {
                res.status(httpStatus.noContent).send()
            } else {
                next(new NotFound())
                next()
            }
            Log.info('controller', 'ReportsController :: Calling Endpoint :: DeleteReport')
        } catch (error) {
            res.locals[reqData.logTag] = 'controller'
            res.locals[reqData.logTrigger] = 'ReportsController :: Calling Endpoint :: DeleteReport'
            next(error)
        }
    }
}
