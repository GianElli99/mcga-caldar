const { request, response } = require('express');
const fs = require('fs');

const obtenerConstructoras = (req = request, res = response) => {
  try {
    const { nombre } = req.query;

    let constructoras = listarConstructoras();

    if (nombre) {
      constructoras = constructoras.filter((constructora) =>
        constructora.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    }

    res.send(constructoras);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerConstructora = (req = request, res = response) => {
  try {
    const constructoraId = parseInt(req.params.id);
    const constructora = listarConstructoras().find(
      (constructora) => constructora.id === constructoraId
    );

    if (constructora) {
      res.json(constructora);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificios = (req = request, res = response) => {
  try {
    const { es_particular, ciudad } = req.query;

    let edificios = listarEdificios();

    if (
      es_particular &&
      (es_particular === 'true' || es_particular === 'false')
    ) {
      let particularBooleano = es_particular === 'true';
      edificios = edificios.filter(
        (edif) => edif.es_particular === particularBooleano
      );
    }

    if (ciudad) {
      edificios = edificios.filter((edif) =>
        edif.ciudad.toLowerCase().includes(ciudad.toLowerCase())
      );
    }

    res.send(edificios);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificio = (req = request, res = response) => {
  try {
    const edificioId = parseInt(req.params.id);
    const edificio = listarEdificios().find(
      (edificio) => edificio.id === edificioId
    );

    if (edificio) {
      res.json(edificio);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const listarConstructoras = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/constructoras.json')
  );
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

const listarEdificios = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/edificios.json')
  );
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

module.exports = {
  obtenerConstructoras,
  obtenerConstructora,
  obtenerEdificio,
  obtenerEdificios,
};
