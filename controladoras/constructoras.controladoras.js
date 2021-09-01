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
    const constructoraId = parseInt(req.params.id);
    const constructora = listarConstructoras().find(
      (constructora) => constructora.id === constructoraId
    );

    if (constructora) {
      res.json(constructora.edificiosIds);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const agregarConstructora = (req = request, res = response) => {
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

const eliminarConstructora = (req = request, res = response) => {
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

const modificarConstructora = (req = request, res = response) => {
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

const listarConstructoras = () => {
  let datosCrudos = fs.readFileSync('./datos/constructoras.json');
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

const guardarConstructoras = (edificios) => {
  fs.writeFileSync(
    './datos/constructoras.json',
    JSON.stringify(edificios, null, 2)
  );
};

module.exports = {
  obtenerConstructoras,
  obtenerConstructora,
  agregarConstructora,
  eliminarConstructora,
  modificarConstructora,
  obtenerEdificios,
};
