const { query, param } = require('express-validator');
const { Router } = require('express');
const {
  obtenerEdificios,
  obtenerEdificio,
  agregarEdificio,
  eliminarEdificio,
  modificarEdificio,
} = require('../controladoras/edificios.controladoras');
const validarCampos = require('../intermediarios/validarCampos');
const generarCadenaValidacionEdificios = require('../intermediarios/generarCadenaValidacionEdificios');

const router = Router();

router.get(
  '/',
  [query('ciudad').trim(), query('es_particular').toBoolean(), validarCampos],
  obtenerEdificios
);

router.get('/:id', [param('id').isMongoId(), validarCampos], obtenerEdificio);

router.post(
  '/',
  [...generarCadenaValidacionEdificios(), validarCampos],
  agregarEdificio
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    ...generarCadenaValidacionEdificios(),
    validarCampos,
  ],
  modificarEdificio
);

router.delete(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  eliminarEdificio
);

module.exports = router;
