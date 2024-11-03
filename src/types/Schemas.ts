export type Filter = {
    name?: string
    email?: string
    discord_id?: string
    id?: string
    username?: string
    page?: number
    limit?: number
}

export type FilterReport = {
    user_id: string
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
    is_admin: boolean
    name: string
    email: string
    password: string
    discord_id: string
    roles: string[]
    date_of_birth: string
    pronouns: string
    phone: string
    joined_at: string
    left_at: string
    created_by: string
    created_at: string
    updated_at: string
}

export type Role = {
    _id: string
    id?: string
    name: string
    description: string
    permissions: string[]
    created_at: string
    updated_at: string
}

export type Report = {
    _id: string
    id?: string
    user_id: string
    type: string
    is_first_occurrence: boolean
    severity: string
    description: string
    date_time: string
    place: string
    additional_info: string
    followup: string
    witnesses: ReportDetails[]
    people_involved: ReportDetails[]
    created_at: string
    updated_at: string
}

export type ReportDetails = {
    name: string
    contact_info: string
    relation: string
    report: string
}
