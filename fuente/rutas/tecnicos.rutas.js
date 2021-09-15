const { query, param } = require('express-validator');
const { Router } = require('express');
const {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
} = require('../controladoras/tecnicos.controladoras');
const convertirStringEnArray = require('../utilidades/convertirStringEnArray');
const validarCampos = require('../intermediarios/validarCampos');
const generarCadenaValidacionTecnicos = require('../intermediarios/generarCadenaValidacionTecnicos');

const router = Router();

router.get(
  '/',
  [
    query('especializaciones').customSanitizer((especializaciones) =>
      convertirStringEnArray(especializaciones, ',')
    ),
    query('estricto').toBoolean(),
  ],
  obtenerTecnicos
);

router.get('/:id', [param('id').isMongoId(), validarCampos], obtenerTecnico);

router.post(
  '/',
  [...generarCadenaValidacionTecnicos(), validarCampos],
  agregarTecnico
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    ...generarCadenaValidacionTecnicos(),
    validarCampos,
  ],
  modificarTecnico
);

router.delete(
  '/:id',
  [param('id').isMongoId(), validarCampos],
  eliminarTecnico
);

module.exports = router;
