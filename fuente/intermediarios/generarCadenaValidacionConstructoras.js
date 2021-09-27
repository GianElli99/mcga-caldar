const { body } = require('express-validator');
const validarStringSoloNumeros = require('../utilidades/validarStringSoloNumeros');

const generarCadenaValidacionConstructoras = () => {
  return [
    body('nombre', 'El tipo es invalido').notEmpty().isString().trim(),
    body('cuit', 'El cuit no es valido')
      .notEmpty()
      .isString()
      .trim()
      .custom(validarStringSoloNumeros),
    body('telefono', 'El telefono no es valido')
      .notEmpty()
      .isString()
      .trim()
      .custom(validarStringSoloNumeros),
  ];
};

module.exports = generarCadenaValidacionConstructoras;
