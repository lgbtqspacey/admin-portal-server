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
    '/api/admin/users',
    Auth.jwt,
    ValidateRequest.user,
    AdminController.createUser,
    adminRouter
)

adminRouter.get(
    '/api/admin/users',
    Auth.jwt,
    ValidateRequest.filter,
    AdminController.getUser,
    adminRouter
)

adminRouter.patch(
    '/api/admin/users/:id',
    Auth.jwt,
    ValidateRequest.user,
    AdminController.updateUser,
    adminRouter
)

adminRouter.delete(
    '/api/admin/users/:id',
    Auth.jwt,
    ValidateRequest.id,
    AdminController.deleteUser,
    adminRouter
)

/**
 * Role management routes
 */
adminRouter.post(
    '/api/admin/roles',
    Auth.jwt,
    ValidateRequest.role,
    RolesController.createRole,
    adminRouter
)

adminRouter.get(
    '/api/admin/roles',
    Auth.jwt,
    ValidateRequest.filter,
    RolesController.getRoles,
    adminRouter
)

adminRouter.put(
    '/api/admin/roles/:id',
    Auth.jwt,
    ValidateRequest.role,
    RolesController.updateRole,
    adminRouter
)

adminRouter.delete(
    '/api/admin/roles/:id',
    Auth.jwt,
    ValidateRequest.id,
    RolesController.deleteRole,
    adminRouter
)

/**
 * Reports management routes
 */
adminRouter.post(
    '/api/admin/reports',
    Auth.jwt,
    ValidateRequest.report,
    ReportsController.createReport,
    adminRouter
)

adminRouter.get(
    '/api/admin/reports',
    Auth.jwt,
    ValidateRequest.filterReports,
    ReportsController.getReportsByUser,
    adminRouter
)

adminRouter.put(
    '/api/admin/reports/:id',
    Auth.jwt,
    ValidateRequest.report,
    ReportsController.updateReport,
    adminRouter
)

adminRouter.delete(
    '/api/admin/reports/:id',
    Auth.jwt,
    ValidateRequest.id,
    ReportsController.deleteReport,
    adminRouter
)

export { adminRouter }
