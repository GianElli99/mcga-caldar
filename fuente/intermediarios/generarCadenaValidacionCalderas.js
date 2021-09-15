const { body } = require('express-validator');
const convertirElementosAMayusculas = require('../utilidades/convertirElementosAMayusculas');

const generarCadenaValidacionCalderas = () => {
  return [
    body('tipo', 'El tipo es inválido')
      .trim()
      .notEmpty()
      .isString()
      .customSanitizer(convertirElementosAMayusculas),
    body('estaInstalada', 'El valor es inválido').trim().notEmpty().isBoolean(),
    body('tiempoMantenimientoMinutos', 'El tiempo es invalido')
      .trim()
      .notEmpty()
      .isNumeric(),
    // body('edificioId', 'El Id del eficio no es correcto')
    //   .trim()
    //   .notEmpty()
    //   .isString(),
  ];
};

module.exports = generarCadenaValidacionCalderas;
