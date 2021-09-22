const { request, response } = require('express');
const Mantenimiento = require('../modelos/mantenimiento');
const Caldera = require('../modelos/caldera');
const Tecnico = require('../modelos/tecnico');

const obtenerMantenimientos = async (req = request, res = response) => {
  try {
    const { calderaId, tecnicoId, realizado, tipo } = req.query;

    let condicionesFiltro = {};
    if (tecnicoId) {
      condicionesFiltro.tecnicoId = tecnicoId;
    }
    if (calderaId) {
      condicionesFiltro.calderaId = calderaId;
    }
    if (realizado === true || realizado === false) {
      condicionesFiltro.realizado = realizado;
    }
    if (tipo) {
      condicionesFiltro.tipo = tipo;
    }

    const mantenimientos = await Mantenimiento.find(condicionesFiltro);

    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerMantenimiento = async (req = request, res = response) => {
  try {
    const mantenimientoId = req.params.id;
    const mantenimiento = await Mantenimiento.findById(mantenimientoId)
      .populate('calderaId')
      .populate('tecnicoId');

    if (mantenimiento) {
      res.json(mantenimiento);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const generarMantenimiento = async (req = request, res = response) => {
  try {
    let mantenimiento = new Mantenimiento(req.body);

    if (mantenimiento.tipo === 'Mensual') {
      mantenimiento.descripcion = undefined;
      mantenimiento.tiempoMinutos = undefined;
    }
    if (!mantenimiento.realizado) {
      mantenimiento.fechaRealizado = undefined;
    }

    const caldera = await Caldera.findOne({
      _id: mantenimiento.calderaId,
      estaInstalada: true,
    });
    if (!caldera) {
      return res
        .status(400)
        .json({ error: 'La caldera seleccionada no es válida' });
    }
    if (mantenimiento.tecnicoId) {
      const tecnico = await Tecnico.findOne({
        _id: mantenimiento.tecnicoId,
        especializaciones: caldera.tipo,
      });
      if (!tecnico) {
        return res
          .status(400)
          .json({ error: 'El técnico seleccionado no es válido' });
      }
    }

    if (mantenimiento.tipo === 'Mensual') {
      const primerDiaMes = new Date(
        mantenimiento.fecha.getUTCFullYear(),
        mantenimiento.fecha.getUTCMonth(),
        1
      );
      const ultimoDiaMes = new Date(
        mantenimiento.fecha.getUTCFullYear(),
        mantenimiento.fecha.getUTCMonth() + 1,
        0
      );

      const mantenMensualEnMismoMes = await Mantenimiento.findOne({
        calderaId: mantenimiento.calderaId,
        fecha: {
          $gte: primerDiaMes,
          $lt: ultimoDiaMes,
        },
        tipo: 'Mensual',
      });
      if (mantenMensualEnMismoMes) {
        return res.status(400).json({
          error:
            'Ya existe un mantenimiento mensual para esta caldera en el mes ingresado',
        });
      }
    }

    await mantenimiento.save();
    res.status(201).json(mantenimiento);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const generarMantenimientos = async (_req = request, res = response) => {
  try {
    // foreach caldera instalada generar un mantenimiento mensual
    const calderas = await Caldera.find({ estaInstalada: true });

    let mantenimientos = [];
    for (let i = 0; i < calderas.length; i++) {
      const mantenimiento = new Mantenimiento({
        tipo: 'Mensual',
        realizado: false,
        fecha: Date.now(),
        calderaId: calderas[i]._id,
      });
      mantenimientos.push(mantenimiento);
    }

    const tecnicos = await Tecnico.find({});

    let tecnicosDeUnaEspecializacion = {
      A: tecnicos.filter(
        (tec) =>
          tec.especializaciones.includes('A') &&
          tec.especializaciones.length === 1
      ),
      B: tecnicos.filter(
        (tec) =>
          tec.especializaciones.includes('B') &&
          tec.especializaciones.length === 1
      ),
      C: tecnicos.filter(
        (tec) =>
          tec.especializaciones.includes('C') &&
          tec.especializaciones.length === 1
      ),
      D: tecnicos.filter(
        (tec) =>
          tec.especializaciones.includes('D') &&
          tec.especializaciones.length === 1
      ),
    };

    for (let i = 0; i < mantenimientos.length; i++) {
      const { tipo } = calderas.find(
        (caldera) => caldera._id === mantenimientos[i].calderaId
      );
      if (tecnicosDeUnaEspecializacion[tipo].length > 0) {
        mantenimientos[i].tecnicoId = tecnicosDeUnaEspecializacion[tipo][0]._id;
        tecnicosDeUnaEspecializacion[tipo].push(
          tecnicosDeUnaEspecializacion[tipo].shift()
        );
      }
    }

    let tecnicosPorEspecializacion = {
      A: tecnicos.filter((tec) => tec.especializaciones.includes('A')),
      B: tecnicos.filter((tec) => tec.especializaciones.includes('B')),
      C: tecnicos.filter((tec) => tec.especializaciones.includes('C')),
      D: tecnicos.filter((tec) => tec.especializaciones.includes('D')),
    };

    for (let i = 0; i < mantenimientos.length; i++) {
      const { tipo } = calderas.find(
        (caldera) => caldera._id === mantenimientos[i].calderaId
      );
      if (
        tecnicosPorEspecializacion[tipo].length > 0 &&
        !mantenimientos[i].tecnicoId
      ) {
        mantenimientos[i].tecnicoId = tecnicosPorEspecializacion[tipo][0]._id;
        tecnicosPorEspecializacion[tipo].push(
          tecnicosPorEspecializacion[tipo].shift()
        );
      }
    }

    return res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarMantenimiento = async (req = request, res = response) => {
  try {
    const mantenimientoId = req.params.id;
    let mantenimiento = req.body;

    if (mantenimiento.tipo === 'Mensual') {
      mantenimiento.descripcion = undefined;
      mantenimiento.tiempoMinutos = undefined;
    }
    if (!mantenimiento.realizado) {
      mantenimiento.fechaRealizado = undefined;
    }

    const caldera = await Caldera.findOne({
      _id: mantenimiento.calderaId,
      estaInstalada: true,
    });
    if (!caldera) {
      return res
        .status(400)
        .json({ error: 'La caldera seleccionada no es válida' });
    }
    if (mantenimiento.tecnicoId) {
      const tecnico = await Tecnico.findOne({
        _id: mantenimiento.tecnicoId,
        especializaciones: caldera.tipo,
      });
      if (!tecnico) {
        return res
          .status(400)
          .json({ error: 'El técnico seleccionado no es válido' });
      }
    }

    if (mantenimiento.tipo === 'Mensual') {
      const primerDiaMes = new Date(
        mantenimiento.fecha.getUTCFullYear(),
        mantenimiento.fecha.getUTCMonth(),
        1
      );
      const ultimoDiaMes = new Date(
        mantenimiento.fecha.getUTCFullYear(),
        mantenimiento.fecha.getUTCMonth() + 1,
        0
      );

      const mantenMensualEnMismoMes = await Mantenimiento.findOne({
        calderaId: mantenimiento.calderaId,
        fecha: {
          $gte: primerDiaMes,
          $lt: ultimoDiaMes,
          _id: { $ne: mantenimientoId },
        },
        tipo: 'Mensual',
      });
      if (mantenMensualEnMismoMes) {
        return res.status(400).json({
          error:
            'Ya existe un mantenimiento mensual para esta caldera en el mes ingresado',
        });
      }
    }

    mantenimiento = await Mantenimiento.findByIdAndUpdate(
      mantenimientoId,
      mantenimiento,
      { new: true }
    );

    res.json(mantenimiento);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarMantenimiento = async (req = request, res = response) => {
  try {
    const mantenimientoId = req.params.id;

    const mantenimiento = await Mantenimiento.findByIdAndRemove(
      mantenimientoId
    );

    if (mantenimiento) {
      res.json(mantenimiento);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
};
