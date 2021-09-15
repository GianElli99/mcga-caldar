const convertirStringEnArray = (valor = '', separador) => {
  if (!valor) {
    return [];
  }
  let resultado = valor.trim().toUpperCase().split(separador);
  return resultado;
};

module.exports = convertirStringEnArray;
