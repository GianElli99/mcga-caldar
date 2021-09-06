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
  } catch (error) {
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

module.exports = {
  obtenerMantenimientos,
  obtenerMantenimiento,
  generarMantenimientos,
  modificarMantenimiento,
  eliminarMantenimiento,
};
