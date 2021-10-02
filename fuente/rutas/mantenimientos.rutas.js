const { Router } = require('express');
const { param, query, body } = require('express-validator');

const {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-mensuales.controladoras');
const generarCadenaValidacionMantenimientos = require('../intermediarios/generarCadenaValidacionMantenimientos');
const validarCampos = require('../intermediarios/validarCampos');
const capitalizarPrimerLetra = require('../utilidades/capitalizarPrimerLetra');

const router = Router();

router.get(
  '/',
  [
    query('calderaId').optional().isMongoId(),
    query('tecnicoId').optional().isMongoId(),
    query('realizado').optional().isBoolean().toBoolean(),
    query('tipo')
      .optional()
      .isString()
      .trim()
      .customSanitizer(capitalizarPrimerLetra),
    validarCampos,
  ],
  obtenerMantenimientos
);

router.get(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  obtenerMantenimiento
);

router.post(
  '/automatico',
  [
    body('fecha').isDate(),
    body('bloqueMantenimientoEventualMinutos').isNumeric().toInt(),
    validarCampos,
  ],
  generarMantenimientos
);

router.post(
  '/',
  [...generarCadenaValidacionMantenimientos(), validarCampos],
  generarMantenimiento
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    ...generarCadenaValidacionMantenimientos(),
    validarCampos,
  ],
  modificarMantenimiento
);

router.delete(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  eliminarMantenimiento
);

module.exports = router;
