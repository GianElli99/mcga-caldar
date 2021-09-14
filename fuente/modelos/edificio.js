const { Schema, model } = require('mongoose');

const EdificioSchema = Schema({
  direccion: {
    type: String,
    required: [true, 'El campo direccion es obligatorio'],
  },
  ciudad: {
    type: String,
    required: [true, 'El campo ciudad es obligatorio'],
  },
  nombre: {
    type: String,
    required: [true, 'El campo nombre es obligatorio'],
  },
  codigoPostal: {
    type: String,
    required: [true, 'El campo codigoPostal es obligatorio'],
  },
  esParticular: {
    type: Boolean,
    required: [true, 'El campo esParticular es obligatorio'],
  },
  constructoraId: {
    type: Schema.Types.ObjectId,
    ref: 'Constructora',
  },
});

module.exports = model('Edificio', EdificioSchema);
