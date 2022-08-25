import { Request, Response, NextFunction } from "express"
import { ResponseWrapper } from "./responseWrapper"

export class ErrorWrapper {
    message: any
    code: number
    status: string

    constructor(message: any, code: number, status: string) {
        //super(message)
        this.message = message
        this.code = code
        this.status = status
    }
}

export const handler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof ErrorWrapper) {
            return res.status(err.code).send(new ResponseWrapper(
                null, err, null
            ))
        }
        return res.status(500).send(new ResponseWrapper(
            null, {
                message: err.message || err,
                code: 500,
                status: "err.unhandledException"
            }, null
        ))
    }
}

export const Errors = {
    MISSING_TOKEN: new ErrorWrapper("No token found", 401, "error.noToken"),
    MISSING_ID: new ErrorWrapper("Request is missing the required 'id'(s) property", 422, "error.missingID"),
    MISSING_FILE: new ErrorWrapper("Request is missing the file(s) to supposedly upload", 422, "error.missingFile"),
    MISSING_PROPERTIES: new ErrorWrapper("Request is missing the the required properties", 422, "error.missingProperties"),
    ALREADY_GENRED: new ErrorWrapper("Genre already assigned to movie", 400, "error.genreAlreadyAssigned"),
    ALREADY_RATED: new ErrorWrapper("Movie already rated by user", 400, "error.movieAlreadyRated"),
    BLANK: new ErrorWrapper("Search query is blank", 422, "error.blankQuery"),
    NO_RESOURCE: new ErrorWrapper("Resource not found", 404, "error.noResource"),
    NO_ACCOUNT: new ErrorWrapper("Account not found", 404, "error.noAccount"),
    NO_MOVIE: new ErrorWrapper("Movie not found", 404, "error.noMovie"),
    WRONG_PASSWORD: new ErrorWrapper("Wrong password", 401, "error.wrongPassword"),
    TOKEN_EXPIRED: new ErrorWrapper("Token has expired", 403, "error.tokenExpired"),
}