const { request, response } = require('express');
const fs = require('fs');
const path = require('path');

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

const agregarEdificio = (req = request, res = response) => {
  try {
    const {
      direccion = '',
      ciudad = '',
      codigo_postal = '',
      es_particular = true,
      contacto = '',
    } = req.body;
    const id = Math.round(Math.random() * 1000);

    const nuevoEdificio = {
      id,
      direccion,
      ciudad,
      codigo_postal,
      es_particular,
      contacto,
    }; //TODO: necesita refactorizacion, crear clase edificio
    const edificios = listarEdificios();
    edificios.push(nuevoEdificio);
    guardarEdificios(edificios);

    res.json(nuevoEdificio);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarEdificio = (req = request, res = response) => {
  try {
    const edificioId = parseInt(req.params.id);
    let edificios = listarEdificios();

    const edificioAEliminar = edificios.find(
      (edificio) => edificio.id === edificioId
    );

    if (edificioAEliminar) {
      edificios = edificios.filter(
        (edificio) => edificio !== edificioAEliminar
      );
      guardarEdificios(edificios);

      res.json(edificioAEliminar);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarEdificio = (req = request, res = response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      direccion = '',
      ciudad = '',
      codigo_postal = '',
      es_particular = true,
      contacto = '',
    } = req.body;

    const edificioModificado = {
      id,
      direccion,
      ciudad,
      codigo_postal,
      es_particular,
      contacto,
    }; //TODO: necesita refactorizacion, crear clase edificio
    let edificios = listarEdificios();
    let modificacionRealizada = false;
    for (let i = 0; i < edificios.length; i++) {
      if (edificioModificado.id === edificios[i].id) {
        edificios[i] = edificioModificado;
        modificacionRealizada = true;
        break;
      }
    }
    if (modificacionRealizada) {
      guardarEdificios(edificios);
      res.json(edificioModificado);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const listarEdificios = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/edificios.json')
  );
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

const guardarEdificios = (edificios) => {
  fs.writeFileSync(
    path.resolve(__dirname, '../datos/edificios.json'),
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
