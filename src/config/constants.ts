import multer from "multer"

export const Constants = {
  REDIS_CONNECTION: {
    connection: { port: 6379, host: 'moviedb.baywqv.ng.0001.use2.cache.amazonaws.com' }
  },

  POSTER_STORAGE: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/assets/posters/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),

  MEDIA_STORAGE: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/assets/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),

  ACTOR_STORAGE: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/assets/actors/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  }),

  ASSETS: "http://localhost:" + process.env.PORT + "/assets/"
}
