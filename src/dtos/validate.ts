import { validate } from "class-validator"
import { ErrorWrapper } from "../helpers/wrappers/errorWrapper"

export const validateDTO = async (dto: {}): Promise<void> => {
    const validateDTO = await validate(dto)

    if (validateDTO.length > 0){
        throw new ErrorWrapper(
            validateDTO, 400, "err.validation"
        )
    }
}