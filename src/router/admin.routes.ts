import express from 'express'
import AdminController from '../controller/AdminController'
import ReportsController from '../controller/ReportsController'
import RolesController from '../controller/RolesController'
import Auth from '../middleware/Auth'
import ValidateRequest from '../middleware/ValidateRequest'

const adminRouter = express.Router()
/**
 * User management routes
 */
adminRouter.post(
    '/api/v1/admin/users',
    Auth.session,
    ValidateRequest.user,
    AdminController.createUser,
    adminRouter
)

adminRouter.get(
    '/api/v1/admin/users',
    Auth.session,
    ValidateRequest.filterUser,
    AdminController.getUser,
    adminRouter
)

adminRouter.patch(
    '/api/v1/admin/users/:id',
    Auth.session,
    ValidateRequest.user,
    AdminController.updateUser,
    adminRouter
)

adminRouter.delete(
    '/api/v1/admin/users/:id',
    Auth.session,
    ValidateRequest.id,
    AdminController.deleteUser,
    adminRouter
)

/**
 * Role management routes
 */
adminRouter.post(
    '/api/v1/admin/roles',
    Auth.session,
    ValidateRequest.role,
    RolesController.createRole,
    adminRouter
)

adminRouter.get(
    '/api/v1/admin/roles',
    Auth.session,
    ValidateRequest.filterDefault,
    RolesController.getRoles,
    adminRouter
)

adminRouter.put(
    '/api/v1/admin/roles/:id',
    Auth.session,
    ValidateRequest.role,
    RolesController.updateRole,
    adminRouter
)

adminRouter.delete(
    '/api/v1/admin/roles/:id',
    Auth.session,
    ValidateRequest.id,
    RolesController.deleteRole,
    adminRouter
)

/**
 * Reports management routes
 */
adminRouter.post(
    '/api/v1/admin/reports',
    Auth.session,
    ValidateRequest.report,
    ReportsController.createReport,
    adminRouter
)

adminRouter.get(
    '/api/v1/admin/reports',
    Auth.session,
    ValidateRequest.filterReports,
    ReportsController.getReportsByUser,
    adminRouter
)

adminRouter.put(
    '/api/v1/admin/reports/:id',
    Auth.session,
    ValidateRequest.report,
    ReportsController.updateReport,
    adminRouter
)

adminRouter.delete(
    '/api/v1/admin/reports/:id',
    Auth.session,
    ValidateRequest.id,
    ReportsController.deleteReport,
    adminRouter
)

export { adminRouter }
