import { Sequelize } from 'sequelize-typescript'
import { User } from '../models/user.model';
import { Actor } from '../models/actor.model';
import { Movie } from '../models/movie/movie.model';
import { MovieActor } from '../models/movie/movieActor.model';
import { MovieGenre } from '../models/movie/movieGenre.model';
import { MovieMedia } from '../models/movie/movieMedia.model';
import { MovieScore } from '../models/movie/movieScore.model';

export const sequelize: Sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  models: [User, Actor, Movie, MovieActor, MovieGenre, MovieMedia, MovieScore],
  logging: false,
});

export const connect = async () => {
    try {
        await sequelize.authenticate()
        console.log("Connected to MySQL")
    } catch (error) {
        console.log(error)
    }
}