import { validate } from "class-validator"

export const validateDTO = async (dto: {}): Promise<void> => {
    const validateDTO = await validate(dto)

    if (validateDTO.length > 0)
        throw validateDTO
}