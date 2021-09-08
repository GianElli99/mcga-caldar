const { Router } = require('express');

const {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-mensuales.controladoras');

const router = Router();

router.get('/', obtenerMantenimientos); //todos los mant mensuales, agregar filtros

router.get('/:id', obtenerMantenimiento); //filtro por id

router.post('/', generarMantenimientos); //generar la distribucion para el mes

router.put('/:id', modificarMantenimiento); //modificar

router.delete('/:id', eliminarMantenimiento); //eliminar

module.exports = router;
