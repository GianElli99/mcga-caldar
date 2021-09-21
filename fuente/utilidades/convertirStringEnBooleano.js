const convertirStringEnBooleano = (valor) => {
  if (valor === undefined) {
    return undefined;
  }
  if (valor === 'true') {
    return true;
  } else {
    return false;
  }
};

module.exports = convertirStringEnBooleano;
