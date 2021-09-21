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
      // body('edificioId', 'El Id del eficio no es correcto')
      //   .trim()
      //   .isMongoId(),
      [body('estaInstalada').equals('false')],
    ]),
    // body('estaInstalada')
    //   .isBoolean()
    //   .toBoolean()
    //.custom(validarEstaInstaladaConIdEdificio),
    // body('estaInstalada', 'El valor es inválido').trim().notEmpty().isBoolean(),
    // // .customSanitizer(validarEstaInstaladaConIdEdificio),

    // body('edificioId', 'El Id del eficio no es correcto').trim().isMongoId(),
  ];
};

module.exports = generarCadenaValidacionCalderas;
