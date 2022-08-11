import { sequelize } from '../config/database'

export const execProc = async <T>(proc: string, params: {}) : Promise<T> => {
    const data: unknown = await sequelize.query(`
        CALL ${proc};
    `, {
        replacements: params
    })

    return data as T
}