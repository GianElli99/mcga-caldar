const convertirElementosAMayusculas = require('./convertirElementosAMayusculas');

const convertirStringEnArray = (valor = '', separador) => {
  if (!valor) {
    return [];
  }
  let resultado = valor.trim().split(separador);
  resultado = convertirElementosAMayusculas(resultado);
  return resultado;
};

module.exports = convertirStringEnArray;
