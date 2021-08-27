const { request, response } = require('express');
const fs = require('fs');

const getEdificios = (req = request, res = response) => {
  try {
    const edificios = obtenerEdificios();
    res.send(edificios);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const postEdificios = (req = request, res = response) => {
  res.send('Edificios POST desde controladora');
};

const deleteEdificios = (req = request, res = response) => {
  try {
    const edificioId = parseInt(req.params.id);
    const edificios = obtenerEdificios();

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

const putEdificios = (req = request, res = response) => {
  res.send('Edificios PUT desde controladora');
};

const obtenerEdificios = () => {
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
  getEdificios,
  postEdificios,
  deleteEdificios,
  putEdificios,
};
