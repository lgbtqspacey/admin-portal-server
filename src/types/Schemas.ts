export type Filter = {
    name?: string
    email?: string
    discordId?: string
    id?: string
    username?: string
    page?: number
    limit?: number
}

export type FilterReport = {
    userId: string
    from?: string
    to?: string
    page?: number
    limit?: number
}

export type Login = {
    email?: string
    username?: string
    password?: string
}

export type User = {
    _id? : string
    id?: string
    isAdmin: boolean
    name: string
    email: string
    password: string
    discordId: string
    roles: string[]
    dateOfBirth: string
    pronouns: string
    phone: string
    joinedAt: string
    left_at: string
    createdBy: string
    createdAt: string
    updatedAt: string
}

export type Role = {
    _id: string
    id?: string
    name: string
    description: string
    permissions: string[]
    createdAt: string
    updatedAt: string
}

export type Report = {
    _id: string
    id?: string
    userId: string
    type: string
    isFirstOccurrence: boolean
    severity: string
    description: string
    dateTime: string
    place: string
    additionalInfo: string
    followup: string
    witnesses: ReportDetails[]
    peopleInvolved: ReportDetails[]
    createdAt: string
    updatedAt: string
}

export type ReportDetails = {
    name: string
    contactInfo: string
    relation: string
    report: string
}

export type Session = {
    _id?: string
    userId?: string
    token?: string
    createdAt?: string
    expiresAt?: string
    updatedAt?: string
    deviceInfo?: DeviceInfo
}

export type ConfirmationData = {
    userId: string
    token: string
    expiresAt: string,
    deviceInfo: DeviceInfo
}

export type DeviceInfo = {
    os: string
    ip: string
    location: {
        city: string
        region: string
        country: string
    }
}
