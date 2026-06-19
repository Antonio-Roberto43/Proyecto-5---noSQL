const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// 1. GET todas las películas 
router.get('/', async (req, res, next) => {
    try {
        const movies = await Movie.find();
        return res.status(200).json(movies);
    } catch (err) {
        return next(err);
    }
});

// Crear un método post de Movies para crear una nueva película.
router.post('/', async (req, res, next) => {
  try {
    const newMovie = new Movie(req.body);
    const createdMovie = await newMovie.save();
    return res.status(201).json(createdMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    return next(err);
  }
});

// Crear un método put de Movies para modificar una película.
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movieUpdated = await Movie.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!movieUpdated) {
      const error = new Error('No se encontró ninguna película con ese ID');
      error.status = 404;
      return next(error);
    }
    
    return res.status(200).json(movieUpdated);
  } catch (err) {
    if (err.name === 'CastError') {
      err.status = 400;
      err.message = 'El formato del ID introducido no es válido';
    }
    return next(err);
  }
});

// Crear un método delete de Movies para eliminar una película.
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const movieDeleted = await Movie.findByIdAndDelete(id);

    if (!movieDeleted) {
      const error = new Error('No se encontró ninguna película con ese ID');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({ message: 'Película eliminada correctamente', movie: movieDeleted });
  } catch (err) {
    if (err.name === 'CastError') {
      err.status = 400;
      err.message = 'El formato del ID introducido no es válido';
    }
    return next(err);
  }
});

// 2. GET película por ID 
router.get('/id/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const movie = await Movie.findById(id);
        if (movie) {
            return res.status(200).json(movie);
        } else {
            const error = new Error('No movie found by this id');
            error.status = 404;
            return next(error);
        }
    } catch (err) {
        if (err.name === 'CastError') {
            err.status = 400;
            err.message = 'El formato del ID introducido no es válido';
        }
        return next(err);
    }
});

// 3. GET película por título 
router.get('/title/:title', async (req, res, next) => {
    const { title } = req.params;
    try {
        const movieByTitle = await Movie.find({ title: new RegExp(title, 'i') });
        return res.status(200).json(movieByTitle);
    } catch (err) {
        return next(err);
    }
});

// 4. GET películas por género 
router.get('/genre/:genre', async (req, res, next) => {
    const { genre } = req.params;
    try {
        const movieByGenre = await Movie.find({ genre: new RegExp(genre, 'i') });
        return res.status(200).json(movieByGenre);
    } catch (err) {
        return next(err);
    }
});

// 5. GET películas por año 
router.get('/year/:year', async (req, res, next) => {
    const { year } = req.params;
    try {
        const movieByYear = await Movie.find({ year: { $gt: Number(year) } });
        return res.status(200).json(movieByYear);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;