const { body } = require('express-validator');
// const validarEstaInstaladaConIdEdificio = require('../utilidades/validarEstaInstaladaConIdEdificio');

const generarCadenaValidacionCalderas = () => {
  return [
    body('tipo', 'El tipo es inválido')
      .trim()
      .notEmpty()
      .isString()
      .toUpperCase(),
    body('estaInstalada', 'El valor es inválido').trim().notEmpty().isBoolean(),
    // .customSanitizer(validarEstaInstaladaConIdEdificio),
    body('tiempoMantenimientoMinutos', 'El tiempo es invalido')
      .trim()
      .notEmpty()
      .isNumeric(),
    body('edificioId', 'El Id del eficio no es correcto').trim().isMongoId(),
  ];
};

module.exports = generarCadenaValidacionCalderas;
