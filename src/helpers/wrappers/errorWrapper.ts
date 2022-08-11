export class ErrorWrapper {
    message: string
    code: number
    status: string

    constructor(message: string, code: number, status: string) {
        this.message = message
        this.code = code
        this.status = status
    }
}