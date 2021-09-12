const { request, response } = require('express');
const fs = require('fs');
const path = require('path');

const obtenerMantenimientos = (req = request, res = response) => {
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

const agregarMantenimiento = (req = request, res = response) => {
  try {
    const mantenimientos = listarMantenimientos();

    const nuevoMantenimiento = req.body;

    if (
      id === null ||
      dia === null ||
      hecho === null ||
      calderaId === null ||
      tecnicoAsignadoId === null ||
      minutosNecesarios === null ||
      tipoCaldera === null
    ) {
      return res.status(401).json({ error: 'Datos ingresados incorrectos' });
    }

    mantenimientos.push(nuevoMantenimiento);

    guardarMantenimientos(mantenimientos);
    res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarMantenimiento = (req = request, res = response) => {
  try {
    const id = parseInt(req.params.id);

    const {
      dia = '',
      hecho = false,
      calderaId = null,
      tecnicoAsignadoId = null,
      minutosNecesarios = null,
      tipoCaldera = '',
    } = req.body;

    const mantenimientoModificado = {
      id,
      dia,
      hecho,
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

//Se deberia utilizar para hacer las validaciones al agregar
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

const guardarMantenimientos = (mantenimientos) => {
  const guardarMantenimientosData = JSON.stringify(mantenimientos, null, 2);
  fs.writeFileSync(
    path.resolve(__dirname, '../datos/mantenimientos-eventuales.json'),
    guardarMantenimientosData
  );
};

module.exports = {
  obtenerMantenimientos,
  obtenerMantenimiento,
  agregarMantenimiento,
  modificarMantenimiento,
  eliminarMantenimiento,
};
