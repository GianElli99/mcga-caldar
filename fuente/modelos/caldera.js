const { Schema, model } = require('mongoose');

const CalderaSchema = Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['A', 'B', 'C', 'D'],
  },
  estaInstalada: {
    type: Boolean,
    required: [true, 'El campo estaInstalada es obligatorio'],
  },
  tiempoMantenimientoMinutos: {
    type: Number,
    required: [true, 'El campo tiempoMantenimientoMinutos es obligatorio'],
  },
  edificioId: {
    type: Schema.Types.ObjectId,
    ref: 'Edificio',
  },
});

module.exports = model('Caldera', CalderaSchema);
