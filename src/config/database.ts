import { Sequelize } from 'sequelize-typescript'
import { User } from '../models/user.model';
import { Actor } from '../models/actor.model';
import { Movie } from '../models/movie/movie.model';

export const sequelize: Sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  models: [User, Actor, Movie],
  logging: false,
});

export const connect = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connect to MySQL successful")
    } catch (error) {
        console.log(error)
    }
}