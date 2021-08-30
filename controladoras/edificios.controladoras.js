const { request, response } = require('express');
const fs = require('fs');

const obtenerEdificios = (req = request, res = response) => {
  try {
    const edificios = listarEdificios();
    res.send(edificios);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificio = (req = request, res = response) => {
  try {
    const edificios = listarEdificios();
    res.send(edificios);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const agregarEdificio = (req = request, res = response) => {
  res.send('Edificios POST desde controladora');
};

const eliminarEdificio = (req = request, res = response) => {
  try {
    const edificioId = parseInt(req.params.id);
    const edificios = listarEdificios();

    const edificiosRestantes = edificios.filter(
      (edificio) => edificio.id !== edificioId
    );

    if (edificiosRestantes.length !== edificios.length) {
      guardarEdificios(edificiosRestantes);

      res.json({
        mensaje: 'Edificio eliminado correctamente',
      });
    } else {
      res.json({
        mensaje: 'No se ha encontrado ningún edificio con tal ID',
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarEdificio = (req = request, res = response) => {
  res.send('Edificios PUT desde controladora');
};

const listarEdificios = () => {
  let datosCrudos = fs.readFileSync('./datos/edificios.json');
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

const guardarEdificios = (edificios) => {
  fs.writeFileSync(
    './datos/edificios.json',
    JSON.stringify(edificios, null, 2)
  );
};

module.exports = {
  obtenerEdificios,
  obtenerEdificio,
  agregarEdificio,
  eliminarEdificio,
  modificarEdificio,
};
