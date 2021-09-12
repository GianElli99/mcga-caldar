const { Router } = require('express');

const {
  obtenerMantenimientos,
  obtenerMantenimiento,
  agregarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
} = require('../controladoras/mantenimientos-eventuales.controladoras');

const router = Router();

router.get('/', obtenerMantenimientos);

router.get('/:id', obtenerMantenimiento);

router.post('/', agregarMantenimiento);

router.put('/:id', modificarMantenimiento);

router.delete('/:id', eliminarMantenimiento);

module.exports = router;
