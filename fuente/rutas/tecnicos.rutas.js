const { query, body } = require('express-validator');
const { Router } = require('express');
const {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
} = require('../controladoras/tecnicos.controladoras');
const convertirStringEnArray = require('../utilidades/convertirStringEnArray');
const validarCampos = require('../intermediarios/validarCampos');
const convertirElementosAMayusculas = require('../utilidades/convertirElementosAMayusculas');

const router = Router();

router.get(
  '/',
  [
    query('especializaciones').customSanitizer((especializaciones) =>
      convertirStringEnArray(especializaciones, ',')
    ),
    query('estricto').toBoolean(),
  ],
  obtenerTecnicos
);

router.get('/:id', obtenerTecnico);

router.post(
  '/',
  [
    body('nombre', 'El nombre es inválido').trim().notEmpty().isString(),
    body('apellido', 'El apellido es inválido').trim().notEmpty().isString(),
    body('especializaciones', 'Las especializaciones son inválidas')
      .isArray()
      .customSanitizer(convertirElementosAMayusculas),
    body('telefono', 'El telefono es inválido').trim().notEmpty().isString(),
    body('dni', 'El dni es inválido').trim().notEmpty().isString(),
    body('direccion', 'La direccion es inválida').trim().notEmpty().isString(),
    validarCampos,
  ],
  agregarTecnico
);

router.put('/:id', modificarTecnico);

router.delete('/:id', eliminarTecnico);

module.exports = router;
