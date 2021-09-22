const { request, response } = require('express');
const Mantenimiento = require('../modelos/mantenimiento');
const fs = require('fs');
const path = require('path');
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

const generarMantenimientos = (_req = request, res = response) => {
  try {
    // foreach caldera instalada generar un mantenimiento mensual
    const calderas = listarCalderas();
    let mantenimientos = [];
    for (let i = 0; i < calderas.length; i++) {
      let mantenimiento = {
        id: Math.round(Math.random() * 10000),
        numeroMes: new Date().getMonth() + 1,
        hecho: false,
        calderaId: calderas[i].id,
        tecnicoAsignadoId: null,
        minutosNecesarios: 300,
        tipoCaldera: calderas[i].descripcion,
      };
      mantenimientos.push(mantenimiento);
    }
    //conseguir los tecnicos que solo saben reparar un tipo de caldera
    //falta contemplar horas de trabajo
    const tecnicos = listarTecnicos();
    let tecnicosExclusivos = {
      A: obtenerIdsTecnicosExclusivos('A', tecnicos),
      B: obtenerIdsTecnicosExclusivos('B', tecnicos),
      C: obtenerIdsTecnicosExclusivos('C', tecnicos),
      D: obtenerIdsTecnicosExclusivos('D', tecnicos),
    };

    for (let i = 0; i < mantenimientos.length; i++) {
      let { tipoCaldera } = mantenimientos[i];
      if (tecnicosExclusivos[tipoCaldera].length > 0) {
        mantenimientos[i].tecnicoAsignadoId =
          tecnicosExclusivos[tipoCaldera][0];
        tecnicosExclusivos[tipoCaldera].push(
          tecnicosExclusivos[tipoCaldera].shift()
        );
      }
    }
    let tecnicosFlexibles = {
      A: obtenerIdsTecnicos('A', tecnicos),
      B: obtenerIdsTecnicos('B', tecnicos),
      C: obtenerIdsTecnicos('C', tecnicos),
      D: obtenerIdsTecnicos('D', tecnicos),
    };
    for (let i = 0; i < mantenimientos.length; i++) {
      let { tipoCaldera } = mantenimientos[i];
      if (!mantenimientos[i].tecnicoAsignadoId) {
        mantenimientos[i].tecnicoAsignadoId = tecnicosFlexibles[tipoCaldera][0];
        tecnicosFlexibles[tipoCaldera].push(
          tecnicosFlexibles[tipoCaldera].shift()
        );
      }
    }

    guardarMantenimientos(mantenimientos);
    res.json(mantenimientos);

    // asignar un tecnico a cada mantenimiento mensual
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

const eliminarMantenimiento = (req = request, res = response) => {
  try {
    const mantenimientoId = parseInt(req.params.id);
    let mantenimientos = listarMantenimientos();

    const mantenimientoAEliminar = mantenimientos.find(
      (manten) => manten.id === mantenimientoId
    );

    if (mantenimientoAEliminar) {
      mantenimientos = mantenimientos.filter(
        (manten) => manten !== mantenimientoAEliminar
      );
      guardarMantenimientos(mantenimientos);

      res.json(mantenimientoAEliminar);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const listarMantenimientos = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/mantenimientos-mensuales.json')
  );
  let mantenimientos = JSON.parse(datosCrudos);

  return mantenimientos;
};

const guardarMantenimientos = (mantenimientos) => {
  fs.writeFileSync(
    path.resolve(__dirname, '../datos/mantenimientos-mensuales.json'),
    JSON.stringify(mantenimientos, null, 2)
  );
};

const listarCalderas = () => {
  let calderasJson = fs.readFileSync(
    path.resolve(__dirname, '../datos/calderas.json')
  );
  return JSON.parse(calderasJson);
};

const listarTecnicos = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/tecnicos.json')
  );
  let tecnicos = JSON.parse(datosCrudos);

  return tecnicos;
};

const obtenerIdsTecnicosExclusivos = (tipoCaldera, tecnicos) => {
  let tecnicosExclusivosIds = [];
  for (let i = 0; i < tecnicos.length; i++) {
    if (
      tecnicos[i].especializacion.length === 1 &&
      tecnicos[i].especializacion[0] === tipoCaldera
    ) {
      tecnicosExclusivosIds.push(tecnicos[i].id);
    }
  }
  return tecnicosExclusivosIds;
};

const obtenerIdsTecnicos = (tipoCaldera, tecnicos) => {
  let tecnicosIds = [];
  for (let i = 0; i < tecnicos.length; i++) {
    for (let j = 0; j < tecnicos[i].especializacion.length; j++) {
      if (tecnicos[i].especializacion[j] === tipoCaldera) {
        tecnicosIds.push(tecnicos[i].id);
      }
    }
  }
  return tecnicosIds;
};

module.exports = {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
};
