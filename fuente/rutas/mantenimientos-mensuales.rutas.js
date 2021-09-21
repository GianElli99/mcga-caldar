const { Router } = require('express');

const {
  obtenerMantenimientosMensuales,
  obtenerMantenimientosEventuales,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-mensuales.controladoras');

const router = Router();

router.get('/mensuales', obtenerMantenimientosMensuales);

router.get('/eventuales', obtenerMantenimientosEventuales);

router.get('/:id', obtenerMantenimiento);

router.post('/automatico', generarMantenimientos);

router.post('/', generarMantenimiento);

router.put('/:id', modificarMantenimiento);

router.delete('/:id', eliminarMantenimiento);

module.exports = router;
