const { Router } = require('express');
const {
  obtenerEdificios,
  obtenerEdificio,
  agregarEdificio,
  eliminarEdificio,
  modificarEdificio,
} = require('../controladoras/edificios.controladoras');

const router = Router();

router.get('/', obtenerEdificios);

router.get('/:id', obtenerEdificio);

router.post('/', agregarEdificio);

router.delete('/:id', eliminarEdificio);

router.put('/:id', modificarEdificio);

module.exports = router;
