const { body } = require('express-validator');

const generarCadenaValidacionConstructoras = () => {
  return [
    body('nombre', 'El tipo es invalido').notEmpty().isString().trim(),
    body('cuit', 'El cuit no es valido').notEmpty().isString().trim(),
    body('telefono', 'El telefono no es valido').notEmpty().isString().trim(),
  ];
};

module.exports = generarCadenaValidacionConstructoras;
