const { Router } = require('express');

const {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-mensuales.controladoras');

const router = Router();

router.get('/', obtenerMantenimientos); //todos los mant mensuales, agregar filtros

router.get('/:id', obtenerMantenimiento); //filtro por id

router.post('/automatico', generarMantenimientos); //generar la distribucion para el mes

router.post('/', generarMantenimiento);

router.put('/:id', modificarMantenimiento); //modificar

router.delete('/:id', eliminarMantenimiento); //eliminar

module.exports = router;
