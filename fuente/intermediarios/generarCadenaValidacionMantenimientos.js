const { body, oneOf } = require('express-validator');

const generarCadenaValidacionMantenimientos = () => {
  return [
    oneOf([
      [body('tipo').trim().isString().equals('Mensual')],
      [
        body('tipo').trim().isString().equals('Eventual'),
        body('descripcion').trim().isString().notEmpty(),
        body('tiempoMinutos').isNumeric().toInt(),
      ],
    ]),
    body('realizado').isBoolean().toBoolean(),
    body('fechaRealizado').optional().isDate(),
    body('calderaId').isMongoId(),
    body('tecnicoId').isMongoId(),
  ];
};

module.exports = generarCadenaValidacionMantenimientos;
