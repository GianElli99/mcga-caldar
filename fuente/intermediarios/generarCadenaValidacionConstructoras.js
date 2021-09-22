const { body } = require('express-validator');

const generarCadenaValidacionConstructoras = () => {
  return [
    body('nombre', 'El tipo es invalido').trim().notEmpty().toString(),
    body('cuit', 'El cuit no es valido').trim().notEmpty().toString(),
    body('telefono', 'El telefono no es valido').trim().notEmpty().toString(),
  ];
};

module.exports = generarCadenaValidacionConstructoras;
