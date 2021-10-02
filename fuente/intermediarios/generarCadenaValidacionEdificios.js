const { body, oneOf } = require('express-validator');

const generarCadenaValidacionEdificios = () => {
  return [
    body('direccion', 'La direccion es inválida').isString().trim().notEmpty(),
    body('ciudad', 'La ciudad es invalida').isString().trim().notEmpty(),
    body('nombre', 'El nombre es inválido').isString().trim().notEmpty(),
    body('codigoPostal', 'El codigo postal es inválido')
      .isString()
      .trim()
      .notEmpty(),
    oneOf([
      [body('esParticular').equals('true').isBoolean()],
      [
        body('esParticular').equals('false').isBoolean(),
        body(
          'constructoraId',
          'No existe una constructora con esa ID'
        ).isMongoId(),
      ],
    ]),
  ];
};

module.exports = generarCadenaValidacionEdificios;
