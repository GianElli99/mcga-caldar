const mongoose = require('mongoose');

const conectarBD = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONEXION, {
      useNewUrlParser: true,
    });
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  conectarBD,
};
