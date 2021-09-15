const { body } = require('express-validator');
const convertirElementosAMayusculas = require('../utilidades/convertirElementosAMayusculas');

const generarCadenaValidacionTecnicos = () => {
  return [
    body('nombre', 'El nombre es inválido').trim().notEmpty().isString(),
    body('apellido', 'El apellido es inválido').trim().notEmpty().isString(),
    body('especializaciones', 'Las especializaciones son inválidas')
      .isArray()
      .customSanitizer(convertirElementosAMayusculas),
    body('telefono', 'El telefono es inválido').trim().notEmpty().isString(),
    body('dni', 'El dni es inválido').trim().notEmpty().isString(),
    body('direccion', 'La direccion es inválida').trim().notEmpty().isString(),
  ];
};

module.exports = generarCadenaValidacionTecnicos;
