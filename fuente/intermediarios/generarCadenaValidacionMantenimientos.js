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
    oneOf([
      [
        body('realizado').equals('true').toBoolean(),
        body('fechaRealizado').isDate(),
        body('tecnicoId').isMongoId(),
      ],
      [body('realizado').equals('false').toBoolean()],
    ]),
    body('fecha').isDate(),
    body('calderaId').isMongoId(),
    body('tecnicoId').optional().isMongoId(),
  ];
};

module.exports = generarCadenaValidacionMantenimientos;
