const z = require('zod');

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  poster: z.string().url({
    message: 'Poster mus be a valid URL'
  }),
  genre: z.array(
    z.enum([ 'Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Romance', 'Animation', 'Biography', 'Fantasy' ]), {
    required_error: 'Movie genere is requered',
    invalid_type_error: 'Movie genre must be an array of enum Genere'
  }
  )

})

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie(objeto) {
  return movieSchema.partial().safeParse(objeto);
}

module.exports = { validateMovie, validatePartialMovie }