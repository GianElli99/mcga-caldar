const { Router } = require('express');
const {
  obtenerConstructora,
  obtenerConstructoras,
  obtenerEdificio,
  obtenerEdificios,
} = require('../controladoras/clientes.controladoras');

const router = Router();

router.get('/', obtenerConstructoras, obtenerEdificios);

router.get('/:id', obtenerConstructora, obtenerEdificio);
