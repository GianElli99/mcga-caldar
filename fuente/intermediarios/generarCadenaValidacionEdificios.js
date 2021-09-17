const { body } = require('express-validator');

const generarCadenaValidacionEdificios = () => {
  return [
    body('direccion', 'La direccion es inválida').trim().notEmpty().isString(),
    body('ciudad', 'La ciudad es invalida').trim().notEmpty().isString(),
    body('nombre', 'El nombre es inválido').trim().notEmpty().isString(),
    body('codigo_postal', 'El codigo_postal es inválido')
      .trim()
      .notEmpty()
      .isInt(),
    body('es_particular', 'Particular inválido').trim().notEmpty().isBoolean(),
    body('contacto', 'El contacto es inválido').trim().notEmpty().isString(),
  ];
};

module.exports = generarCadenaValidacionEdificios;
