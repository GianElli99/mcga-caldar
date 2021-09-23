const { Schema, model } = require('mongoose');

const TiempoReservado = Schema({
  minutosReservados: {
    type: Number,
    required: [true, 'El campo minutosReservados es obligatorio'],
  },
  minutosUsados: {
    type: Number,
    required: [true, 'El campo minutosUsados es obligatorio'],
  },
  tipoCaldera: {
    type: String,
    required: [true, 'El campo tipoCaldera es obligatorio'],
    enum: ['A', 'B', 'C', 'D'],
  },
  fecha: {
    type: Date,
    required: [true, 'El campo fecha es obligatorio'],
  },
  tecnicoId: {
    type: Schema.Types.ObjectId,
    ref: 'Tecnico',
    required: [true, 'El campo tecnicoId es obligatorio'],
  },
});

module.exports = model('TiempoReservado', TiempoReservado);
