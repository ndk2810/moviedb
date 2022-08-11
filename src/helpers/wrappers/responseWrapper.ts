import { ErrorWrapper } from './errorWrapper'
import { Pagination } from './pagination'

export class ResponseWrapper {
    data: {}
    error: ErrorWrapper
    pagination: Pagination

    // constructor() {}

    constructor(data: {}, error: ErrorWrapper, pagination: Pagination) {
        this.data = data
        this.error = error
        this.pagination = pagination
    }
}