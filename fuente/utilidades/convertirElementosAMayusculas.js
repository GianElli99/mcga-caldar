const convertirElementosAMayusculas = (valor = []) => {
  if (!valor) {
    return [];
  }
  for (let i = 0; i < valor.length; i++) {
    if (typeof valor[i] === 'string') {
      valor[i] = valor[i].toUpperCase();
    }
  }

  return valor;
};
module.exports = convertirElementosAMayusculas;
