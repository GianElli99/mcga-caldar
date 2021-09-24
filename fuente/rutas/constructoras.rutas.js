const { query, param } = require('express-validator');
const { Router } = require('express');
const {
  obtenerConstructoras,
  obtenerConstructora,
  agregarConstructora,
  eliminarConstructora,
  modificarConstructora,
  obtenerEdificios,
} = require('../controladoras/constructoras.controladoras');
const generarCadenaValidacionConstructoras = require('../intermediarios/generarCadenaValidacionConstructoras');
const validarCampos = require('../intermediarios/validarCampos');

const router = Router();

router.get(
  '/',
  [
    query('nombre').isString().trim(),
    query('cuit').isString().trim(),
    query('telefono').isString().trim(),
    validarCampos,
  ],
  obtenerConstructoras
);

router.get(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  obtenerConstructora
);

router.get(
  '/:id/edificios',
  [param('id').isMongoId(), validarCampos],
  obtenerEdificios
);

router.post(
  '/',
  [...generarCadenaValidacionConstructoras(), validarCampos],
  agregarConstructora
);

router.delete(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  eliminarConstructora
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    ...generarCadenaValidacionConstructoras(),
    validarCampos,
  ],
  modificarConstructora
);

module.exports = router;
