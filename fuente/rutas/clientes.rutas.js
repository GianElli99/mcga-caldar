const { Router } = require('express');
const {
  obtenerClientes,
  obtenerCliente,
} = require('../controladoras/clientes.controladoras');

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerCliente);

module.exports = router;
