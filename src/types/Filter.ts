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
