const mongoose = require('mongoose');

const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONEXION, {
      useNewUrlParser: true,
    });
    // eslint-disable-next-line no-console
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

module.exports = {
  conectarBD,
};
