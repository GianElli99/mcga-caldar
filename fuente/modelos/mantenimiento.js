const { Schema, model } = require('mongoose');

const MantenimientoSchema = Schema({
  tipo: {
    type: String,
    required: [true, 'El campo tipo es obligatorio'],
    enum: ['Eventual', 'Mensual'],
  },
  descripcion: {
    type: String,
  },
  tiempoMinutos: {
    type: Number,
  },
  realizado: {
    type: Boolean,
    required: [true, 'El campo realizado es obligatorio'],
  },
  fecha: {
    type: Date,
    required: [true, 'El campo fecha es obligatorio'],
  },
  fechaRealizado: {
    type: Date,
  },
  calderaId: {
    type: Schema.Types.ObjectId,
    ref: 'Caldera',
  },
  tecnicoId: {
    type: Schema.Types.ObjectId,
    ref: 'Tecnico',
  },
});

module.exports = model('Mantenimiento', MantenimientoSchema);
