const validarStringSoloNumeros = (valor = '') => {
  const regex = /^[0-9]*$/;
  return regex.test(valor);
};
module.exports = validarStringSoloNumeros;
