import { RequestHandler } from "express"

export class Pagination {
    limit: number
    page: number
    total: number

    constructor(limit: number, page: number, total: number) {
        this.limit = limit
        this.page = page
        this.total = total
    }
}

export const paginate = (total: number, limit: number, offset: number): Pagination => {
    const page = offset < 1 ? 1 : Math.ceil(offset / limit)

    return new Pagination(limit, page, total)
}

export const setPagination: RequestHandler = (req, res, next) => {
    res.locals.limit = parseInt(req.query.limit as string) || 10
    res.locals.offset = parseInt(req.query.offset as string) || 0

    next()
}