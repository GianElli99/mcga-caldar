const { Router } = require('express');
const { param, query } = require('express-validator');

const {
  obtenerMantenimientos,
  obtenerMantenimientosMensuales,
  obtenerMantenimientosEventuales,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-mensuales.controladoras');
const generarCadenaValidacionMantenimientos = require('../intermediarios/generarCadenaValidacionMantenimientos');
const validarCampos = require('../intermediarios/validarCampos');

const router = Router();

router.get(
  '/',
  [
    query('calderaId').optional().isMongoId(),
    query('tecnicoId').optional().isMongoId(),
    query('realizado').optional().isBoolean().toBoolean(),
    validarCampos,
  ],
  obtenerMantenimientos
);

router.get('/mensuales', obtenerMantenimientosMensuales);

router.get('/eventuales', obtenerMantenimientosEventuales);

router.get('/:id', obtenerMantenimiento);

router.post('/automatico', generarMantenimientos);

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

router.delete('/:id', eliminarMantenimiento);

module.exports = router;
