const { Router } = require('express');
const {
  obtenerConstructoras,
  obtenerConstructora,
  agregarConstructora,
  eliminarConstructora,
  modificarConstructora,
  obtenerEdificios,
} = require('../controladoras/constructoras.controladoras');
// const generarCadenaValidacionConstructoras = require('../intermediarios/generarCadenaValidacionConstructoras');

const router = Router();

router.get('/', obtenerConstructoras);

router.get('/:id', obtenerConstructora);

router.get('/:id/edificios', obtenerEdificios);

router.post('/', agregarConstructora);

router.delete('/:id', eliminarConstructora);

router.put('/:id', modificarConstructora);

module.exports = router;
