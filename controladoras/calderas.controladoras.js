const { request, response } = require('express');
const fs = require('fs');

const obtenerCalderas = (req = request, res = response) => {
  try {
    const calderas = listarCalderas();
    res.send(calderas);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

// const obtenerCaldera = (req = request, res = response) => {
//   res.send('hola crack');
// };

const agregarCaldera = (req = request, res = response) => {
  const calderas = listarCalderas();

  const nuevaCaldera = req.body;

  if (
    nuevaCaldera.id === null ||
    nuevaCaldera.nombre === null ||
    nuevaCaldera.descripcion == null
  ) {
    return res.status(401).json({ error: 'Datos ingresados incorrectos' });
  }

  calderas.push(nuevaCaldera);

  guardarCalderas(calderas);
  res.status(201).json(nuevaCaldera);
};

const modificarCaldera = (req = request, res = response) => {
  const calderaId = req.params.id;
  const calderaData = req.body;
  const calderas = listarCalderas();

  const buscarCalderaId = calderas.find((id) => id.calderaId === calderaId);
  if (!buscarCalderaId) {
    return res.status(409).send('no se encontro la caldera con ese ID');
  }

  const actulizarCaldera = calderas.find((id) => id.calderaId === calderaId);

  actulizarCaldera.push(calderaData);

  guardarCalderas(actulizarCaldera);
  res.status(200).json(calderaData);
};

const eliminarCaldera = (req = request, res = response) => {};

// Metodos utiles
const guardarCalderas = (calderas) => {
  const guardarCalderasData = JSON.stringify(calderas);
  fs.writeFileSync('./datos/calderas.json', guardarCalderasData);
};
const listarCalderas = () => {
  let calderasJson = fs.readFileSync('./datos/calderas.json');
  return JSON.parse(calderasJson);
};

module.exports = {
  obtenerCalderas,
  eliminarCaldera,
  agregarCaldera,
  modificarCaldera,
};
