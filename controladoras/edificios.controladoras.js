const getEdificios = (req, res) => {
  res.send('Edificios GET desde controladora');
};

const postEdificios = (req, res) => {
  res.send('Edificios POST desde controladora');
};

const deleteEdificios = (req, res) => {
  res.send('Edificios DELETE desde controladora');
};

const putEdificios = (req, res) => {
  res.send('Edificios PUT desde controladora');
};

const saludar = (req, res, next) => {
  console.log('Hola');
  next();
};

module.exports = {
  getEdificios,
  postEdificios,
  deleteEdificios,
  putEdificios,
  saludar,
};
