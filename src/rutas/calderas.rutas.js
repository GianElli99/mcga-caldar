const express = require('express');
const router = express.Router();

const {
  obtenerCalderas,
  agregarCaldera,
  eliminarCaldera,
  modificarCaldera,
  obtenerCaldera,
} = require('../controladoras/calderas.controladoras');

router.get('/', obtenerCalderas);

router.get('/:id', obtenerCaldera);

router.post('/', agregarCaldera);

router.delete('/:id', eliminarCaldera);

router.put('/:id', modificarCaldera);

module.exports = router;
