const { request, response } = require('express');
const fs = require('fs');
const path = require('path');

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
      nombre = '',
      cuit = '',
      telefono = '',
      edificiosIds = [],
    } = req.body;
    const id = Math.round(Math.random() * 10000);

    const nuevaConstructora = {
      id,
      nombre,
      cuit,
      telefono,
      edificiosIds,
    }; //TODO: necesita refactorizacion, crear clase constructora
    const constructoras = listarConstructoras();
    constructoras.push(nuevaConstructora);
    guardarConstructoras(constructoras);

    res.json(nuevaConstructora);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarConstructora = (req = request, res = response) => {
  try {
    const constructoraId = parseInt(req.params.id);
    let constructoras = listarConstructoras();

    const constructoraAEliminar = constructoras.find(
      (constructora) => constructora.id === constructoraId
    );

    if (constructoraAEliminar) {
      constructoras = constructoras.filter(
        (constructora) => constructora !== constructoraAEliminar
      );
      guardarConstructoras(constructoras);

      res.json(constructoraAEliminar);
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
      nombre = '',
      cuit = '',
      telefono = '',
      edificiosIds = [],
    } = req.body;

    const constructoraModificada = {
      id,
      nombre,
      cuit,
      telefono,
      edificiosIds,
    }; //TODO: necesita refactorizacion, crear clase constructora
    let constructoras = listarConstructoras();
    let modificacionRealizada = false;
    for (let i = 0; i < constructoras.length; i++) {
      if (constructoraModificada.id === constructoras[i].id) {
        constructoras[i] = constructoraModificada;
        modificacionRealizada = true;
        break;
      }
    }
    if (modificacionRealizada) {
      guardarConstructoras(constructoras);
      res.json(constructoraModificada);
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

const guardarConstructoras = (edificios) => {
  fs.writeFileSync(
    path.resolve(__dirname, '../datos/constructoras.json'),
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
