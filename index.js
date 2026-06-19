const express = require('express');
const { connect } = require('./utils/db');

const movieRoutes = require('./routes/movie.routes');

connect();

const PORT = 3000;
const server = express();

server.use(express.json());

server.use('/movies', movieRoutes);

// 1. CONTROL DE ERRORES: Manejo de rutas que no existen (404)
server.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

// 2. CONTROL DE ERRORES: Manejador global de errores
server.use((error, req, res, next) => {
  return res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || 'Error interno del servidor',
  });
});

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});