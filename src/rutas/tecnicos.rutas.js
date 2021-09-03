const { Router } = require('express');
const {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
} = require('../controladoras/tecnicos.controladoras');

const router = Router();

router.get('/', obtenerTecnicos);

router.get('/:id', obtenerTecnico);

router.post('/', agregarTecnico);

router.put('/:id', modificarTecnico);

router.delete('/:id', eliminarTecnico);

module.exports = router;
