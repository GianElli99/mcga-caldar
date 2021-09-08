const { request, response } = require('express');
const fs = require('fs');
const path = require('path');

const obtenerMantenimientos = (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerMantenimiento = (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const generarMantenimientos = (req = request, res = response) => {
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
      }
    }
    console.log(mantenimientos);
    res.json({});

    // asignar un tecnico a cada mantenimiento mensual
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarMantenimiento = (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarMantenimiento = (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const listarMantenimientos = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../mantenimientos-mensuales.json')
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

module.exports = {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  modificarMantenimiento,
  eliminarMantenimiento,
};
