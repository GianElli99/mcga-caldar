const { request, response } = require('express');
const Mantenimiento = require('../modelos/mantenimiento');
const fs = require('fs');
const path = require('path');
// const Caldera = require('../modelos/caldera');
// const Tecnico = require('../modelos/tecnico');

const obtenerMantenimientosMensuales = (req = request, res = response) => {
  try {
    let { calderaId, tecnicoAsignadoId, tipoCaldera } = req.query;

    let mantenimientos = listarMantenimientos();
    if (calderaId) {
      calderaId = parseInt(calderaId);
      mantenimientos = mantenimientos.filter(
        (manten) => manten.calderaId === calderaId
      );
    }

    if (tecnicoAsignadoId) {
      tecnicoAsignadoId = parseInt(tecnicoAsignadoId);
      mantenimientos = mantenimientos.filter(
        (manten) => manten.tecnicoAsignadoId === tecnicoAsignadoId
      );
    }

    if (tipoCaldera) {
      mantenimientos = mantenimientos.filter(
        (manten) =>
          manten.tipoCaldera.toLowerCase() === tipoCaldera.toLowerCase()
      );
    }
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};
const obtenerMantenimientosEventuales = (req = request, res = response) => {
  try {
    let { calderaId, tecnicoAsignadoId, tipoCaldera } = req.query;

    let mantenimientos = listarMantenimientos();
    if (calderaId) {
      calderaId = parseInt(calderaId);
      mantenimientos = mantenimientos.filter(
        (manten) => manten.calderaId === calderaId
      );
    }

    if (tecnicoAsignadoId) {
      tecnicoAsignadoId = parseInt(tecnicoAsignadoId);
      mantenimientos = mantenimientos.filter(
        (manten) => manten.tecnicoAsignadoId === tecnicoAsignadoId
      );
    }

    if (tipoCaldera) {
      mantenimientos = mantenimientos.filter(
        (manten) =>
          manten.tipoCaldera.toLowerCase() === tipoCaldera.toLowerCase()
      );
    }
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerMantenimiento = (req = request, res = response) => {
  try {
    const mantenimientoId = parseInt(req.params.id);
    const mantenimiento = listarMantenimientos().find(
      (manten) => manten.id === mantenimientoId
    );

    if (mantenimiento) {
      res.json(mantenimiento);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};
const generarMantenimiento = async (req = request, res = response) => {
  try {
    // let esTecnicoValido = true;
    const mantenimiento = new Mantenimiento(req.body);
    mantenimiento.fecha = Date.now();

    if (mantenimiento.tipo === 'Mensual') {
      mantenimiento.descripcion = undefined;
      mantenimiento.tiempoMinutos = undefined;
    }
    // const esCalderaValida = Caldera.findById(mantenimiento.calderaId);
    // if (mantenimiento.tecnicoId) {
    //   esTecnicoValido = Tecnico.findById(mantenimiento.tecnicoId);
    // }

    await mantenimiento.save();
    res.json(mantenimiento);
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

const modificarMantenimiento = (req = request, res = response) => {
  try {
    const id = parseInt(req.params.id);

    const {
      numeroMes = 0,
      hecho = false,
      calderaId = null,
      tecnicoAsignadoId = null,
      minutosNecesarios = null,
      tipoCaldera = '',
    } = req.body;

    const mantenimientoModificado = {
      id,
      hecho,
      numeroMes,
      calderaId,
      tecnicoAsignadoId,
      minutosNecesarios,
      tipoCaldera,
    }; //TODO: necesita refactorizacion
    let mantenimientos = listarMantenimientos();
    let modificacionRealizada = false;
    for (let i = 0; i < mantenimientos.length; i++) {
      if (mantenimientoModificado.id === mantenimientos[i].id) {
        mantenimientos[i] = mantenimientoModificado;
        modificacionRealizada = true;
        break;
      }
    }
    if (modificacionRealizada) {
      guardarMantenimientos(mantenimientos);
      res.json(mantenimientoModificado);
    } else {
      res.json({});
    }
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
  obtenerMantenimientosMensuales,
  obtenerMantenimientosEventuales,
  obtenerMantenimiento,
  generarMantenimientos,
  generarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
};
