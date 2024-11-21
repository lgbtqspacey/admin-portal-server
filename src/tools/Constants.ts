export const reqData = {
    filter: 'filter',
    filterReports: 'filterReports',
    userCreate: 'userCreate',
    userUpdate: 'userUpdate',
    roleCreate: 'roleCreate',
    roleUpdate: 'roleUpdate',
    reportCreate: 'reportCreate',
    reportUpdate: 'reportUpdate',
    logTag: 'logTag',
    logTrigger: 'logTrigger',
    password: 'password',
    projection: 'projection',
    page: 'page',
    limit: 'limit',
    token: 'token',
    confirmationData: 'confirmationData',
}

export const errorMessages = {
    badRequest: '400 - Bad Request',
    loginFailed: '400 - Login Failed - Invalid Credentials',
    authNotProvided: '400 - No token provided',
    invalidToken: '400 - Invalid Token',
    unauthorized: '401 - Unauthorized',
    forbidden: '403 - Forbidden',
    notFound: '404 - Not Found',
    conflict: '409 - Conflict',
    internalServerError: '500 - Internal Server Error',
    serviceUnavailable: '503 - Service Unavailable',
    generic: 'Something went wrong',
}

export const mongoDBErrors = {
    duplicateKey: 11000,
    internalError: 1,
}

export const httpStatus = {
    ok: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    internalServerError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
    connectionTimedOut: 522,
}

export const headers = {
    sessionToken: 'sessionToken',
    sessionExpiration: 'sessionExpiration',
    sessionUserId: 'sessionUserId',
    sessionDeviceOS: 'sessionDeviceOS',
}
