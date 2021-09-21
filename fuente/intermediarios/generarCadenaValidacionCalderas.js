const { body, oneOf } = require('express-validator');

const generarCadenaValidacionCalderas = () => {
  return [
    body('tipo', 'El tipo es inválido')
      .trim()
      .notEmpty()
      .isString()
      .toUpperCase(),
    body('tiempoMantenimientoMinutos', 'El tiempo es invalido')
      .trim()
      .notEmpty()
      .isNumeric()
      .toInt(),
    oneOf([
      [body('estaInstalada').equals('true'), body('edificioId').isMongoId()],
      [body('estaInstalada').equals('false')],
    ]),
    body('estaInstalada').toBoolean(),
  ];
};

module.exports = generarCadenaValidacionCalderas;
