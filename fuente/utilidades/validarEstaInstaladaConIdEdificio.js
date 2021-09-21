// const Caldera = require('../modelos/caldera');
const { body } = require('express-validator');

const validarEstaInstaladaConIdEdificio = (valor) => {
  if (valor) {
    body('edificioId', 'El Id del eficio no es correcto').trim().isMongoId();
  }
};

module.exports = validarEstaInstaladaConIdEdificio;
