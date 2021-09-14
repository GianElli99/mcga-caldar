const { Schema, model } = require('mongoose');

const ConstructoraSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El campo nombre es obligatorio'],
  },
  cuit: {
    type: String,
    required: [true, 'El campo cuit es obligatorio'],
  },
  telefono: {
    type: String,
    required: [true, 'El campo telefono es obligatorio'],
  },
});

module.exports = model('Constructora', ConstructoraSchema);
