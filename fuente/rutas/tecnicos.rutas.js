const { check, query } = require('express-validator');
const { Router } = require('express');
const {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
} = require('../controladoras/tecnicos.controladoras');
const convertirStringEnArray = require('../utilidades/convertirStringEnArray');

const router = Router();

router.get(
  '/',
  [
    query('especializaciones').customSanitizer((especializaciones) =>
      convertirStringEnArray(especializaciones, ',')
    ),
    query('estricto').toBoolean(),
  ],
  obtenerTecnicos
);

router.get('/:id', obtenerTecnico);

router.post('/', agregarTecnico);

router.put('/:id', modificarTecnico);

router.delete('/:id', eliminarTecnico);

module.exports = router;
