const { Schema, model } = require('mongoose');

const TecnicoSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El campo nombre es obligatorio'],
  },
  apellido: {
    type: String,
    required: [true, 'El campo apellido es obligatorio'],
  },
  especializaciones: {
    type: [String],
    default: [],
  },
  telefono: {
    type: String,
    required: [true, 'El campo telefono es obligatorio'],
  },
  dni: {
    type: String,
    required: [true, 'El campo dni es obligatorio'],
  },
  direccion: {
    type: String,
    required: [true, 'El campo direccion es obligatorio'],
  },
});

module.exports = model('Tecnico', TecnicoSchema);
