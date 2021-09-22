const capitalizarPrimerLetra = (valor = '') => {
  if (typeof valor === 'string' && valor.length > 0) {
    valor = valor[0].toUpperCase() + valor.slice(1).toLowerCase();
  }

  return valor;
};
module.exports = capitalizarPrimerLetra;
