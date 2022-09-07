const Joi = require('joi')

const authSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
  isAdmin : Joi.boolean(),
  isModerator : Joi.boolean()
})

const showSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  season: Joi.number().required(),
  episode: Joi.number().required(),
  rating : Joi.number()
})

const movieSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  mainActor: Joi.string(),
  rating : Joi.number()
})

const standupSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  mainActor: Joi.string(),
  rating : Joi.number()
})

const animeSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  creator: Joi.string().required(),
  season: Joi.number().required(),
  episode: Joi.number().required(),
  rating : Joi.number()
})

const commentSchema = Joi.object({
  object: Joi.string().required(),
  user: Joi.string().required(),
  content: Joi.string().required(),
  likes: Joi.number(),
  time : Joi.number()
})

module.exports = {authSchema, movieSchema, showSchema, standupSchema, animeSchema, commentSchema}
