export class Pagination {
    limit: number
    page: number
    total: number

    constructor(limit: number, page: number, total: number) {
        this.limit = 1
        this.page = 1
        this.total = 1
    }
}