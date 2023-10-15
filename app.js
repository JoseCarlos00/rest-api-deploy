const express = require('express');
const app = express();
const path = require('node:path');
const crypto = require('node:crypto');

const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js');

app.disable('x-powered-by');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
  res.render('index');
});

// Todos los recursos que sean MOVIES se identifica con '/movies/
app.get('/movies', (req, res) => {
  const { genre: genero } = req.query;
  console.log('genre: get:', genero);
  // console.log(movies.forEach(movi => movi.genre.forEach(item => console.log(`'${item}'`))));

  if (!genero) return res.json(movies);

  const respuesta = movies.filter(movie =>
    movie.genre.some(g => g.toLowerCase() === genero.toLowerCase())
  );

  if (respuesta.length > 0) return res.json(respuesta);

  res.status(404).json({ message: 'Generos not found' });
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movi => movi.id === id);

  if (movie) return res.json(movie);

  res.status(404).json({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), //uuid v4
    ...result.data,
  };

  movies.push(newMovie);
  console.log(req.body);

  res.status(201).json({ message: 'Movie Create Corrected' });
});

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

  movies.splice(movieIndex, 1);

  return res.json({ message: 'Movie deleted' });
});

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  console.log(id);
  const { year } = result;

  const movie = movies.find(movi => movi.id === id);

  if (!movie) return res.status(404).json({ message: 'Movie no fount' });

  const updateMovie = {
    ...movie,
    ...result.data,
  };

  res.status(201).json({ message: 'Update corected', updateMovie });
});

// Error, La ultima ruta  a la que va a llegar
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>');
});

const PORT = process.env.PORT ?? 3000;

//Listen
app.listen(PORT, () => {
  console.log(`Server listenig on port http://localhost:${PORT}`);
});
