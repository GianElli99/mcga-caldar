const { request, response } = require('express');
const fs = require('fs');

const obtenerCalderas = (req = request, res = response) => {
  try {
    const { descripcion } = req.query;
    let calderas = listarCalderas();

    if (descripcion) {
      calderas = calderas.filter(
        (c) => c.descripcion.toLowerCase() === descripcion.toLowerCase()
      );
    }
    res.send(calderas);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerCaldera = (req = request, res = response) => {
  try {
    const calderaId = parseInt(req.params.id);
    const caldera = listarCalderas().find(
      (caldera) => caldera.id === calderaId
    );

    if (caldera) {
      res.json(caldera);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

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
  try {
    const id = parseInt(req.params.id);
    const { nombre = '', descripcion = '' } = req.body;

    const calderaModificada = {
      id,
      nombre,
      descripcion,
    };

    let calderas = listarCalderas();
    let modificacionRealizada = false;

    for (let i = 0; i < calderas.length; i++) {
      if (calderaModificada.id === calderas[i].id) {
        calderas[i] = calderaModificada;
        modificacionRealizada = true;
        break;
      }
    }
    if (modificacionRealizada) {
      guardarCalderas(calderas);
      res.json(calderaModificada);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarCaldera = (req = request, res = response) => {
  try {
    const calderaId = parseInt(req.params.id);
    let calderas = listarCalderas();

    const calderaAEliminar = calderas.find(
      (caldera) => caldera.id === calderaId
    );

    if (calderaAEliminar) {
      calderas = calderas.filter((caldera) => caldera !== calderaAEliminar);
    }
    guardarCalderas(calderas);

    res.json(calderaAEliminar);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

// Metodos utiles
const guardarCalderas = (calderas) => {
  const guardarCalderasData = JSON.stringify(calderas, null, 2);
  fs.writeFileSync('./datos/calderas.json', guardarCalderasData);
};
const listarCalderas = () => {
  let calderasJson = fs.readFileSync('./datos/calderas.json');
  return JSON.parse(calderasJson);
};

module.exports = {
  obtenerCalderas,
  obtenerCaldera,
  eliminarCaldera,
  agregarCaldera,
  modificarCaldera,
};
