const { query, param } = require('express-validator');
const { Router } = require('express');

const {
  obtenerCalderas,
  agregarCaldera,
  eliminarCaldera,
  modificarCaldera,
  obtenerCaldera,
} = require('../controladoras/calderas.controladoras');
const validarCampos = require('../intermediarios/validarCampos');
const generarCadeValidacionCalderas = require('../intermediarios/generarCadenaValidacionCalderas');
const convertirStringEnBooleano = require('../utilidades/convertirStringEnBooleano');

const router = Router();

router.get(
  '/',
  [
    query('tipo').isString().toUpperCase(),
    query('estaInstalada').customSanitizer(convertirStringEnBooleano),
  ],
  obtenerCalderas
);

router.get('/:id', [param('id').isMongoId(), validarCampos], obtenerCaldera);

router.post(
  '/',
  [...generarCadeValidacionCalderas(), validarCampos],
  agregarCaldera
);

router.delete(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  eliminarCaldera
);

router.put(
  '/:id',
  [param('id').isMongoId(), ...generarCadeValidacionCalderas(), validarCampos],
  modificarCaldera
);

module.exports = router;
