const { request, response } = require('express');
const Caldera = require('../modelos/caldera');

const obtenerCalderas = async (req = request, res = response) => {
  try {
    const { tipo, estaInstalada } = req.query;

    if (tipo) {
      const calderas = await Caldera.find({ tipo: tipo });
      res.send(calderas);
    }

    if (estaInstalada) {
      const calderas = await Caldera.find({ estaInstalada: estaInstalada });
      res.send(calderas);
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerCaldera = async (req = request, res = response) => {
  try {
    const calderaId = req.params.id;
    const caldera = await Caldera.findById(calderaId);

    if (caldera) {
      res.json(caldera);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const agregarCaldera = async (req = request, res = response) => {
  try {
    const caldera = new Caldera(req.body);

    await caldera.save();
    res.send(caldera);
    res.status(201).json(caldera);
  } catch {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const modificarCaldera = (req = request, res = response) => {
  try {
    const calderaId = req.params.id;

    const caldera = await Caldera.findByIdAndUpdate(calderaId, req.body, {
      new: true,
    });

    if (caldera) {
      res.json(caldera);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

let prueba;
const eliminarCaldera = (req = request, res = response) => {
  try {
    const calderaId = req.params.id;

    const caldera = await Caldera.findByIdAndDelete(calderaId);

    if (caldera) {
      res.json(caldera);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerCalderas,
  obtenerCaldera,
  eliminarCaldera,
  agregarCaldera,
  modificarCaldera,
};
