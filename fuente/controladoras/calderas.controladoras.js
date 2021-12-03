const { request, response } = require('express');
const Caldera = require('../modelos/caldera');
const Mantenimiento = require('../modelos/mantenimiento');

const obtenerCalderas = async (req = request, res = response) => {
  try {
    const { tipo, estaInstalada } = req.query;

    let condicionesCaldera = {};
    if (tipo) {
      condicionesCaldera.tipo = tipo;
    }
    if (estaInstalada === true || estaInstalada === false) {
      condicionesCaldera.estaInstalada = estaInstalada;
    }

    const calderas = await Caldera.find(condicionesCaldera);
    res.send(calderas);
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
    res.status(201).json(caldera);
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const modificarCaldera = async (req = request, res = response) => {
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

const eliminarCaldera = async (req = request, res = response) => {
  try {
    const calderaId = req.params.id;

    const calderaSeleccionada = await Caldera.findById(calderaId);
    const mantenimiento = await Mantenimiento.findOne({ calderaId });

    if (calderaSeleccionada.estaInstalada || mantenimiento) {
      return res.json({
        error: 'No se puede eliminar esta caldera',
      });
    } else {
      const caldera = await Caldera.findByIdAndDelete(calderaId);
      if (caldera) {
        res.json(caldera);
      } else {
        res.status(404).json({ error: 'El recurso no existe' });
      }
    }
  } catch (error) {
    res.status(400).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerCalderas,
  obtenerCaldera,
  eliminarCaldera,
  agregarCaldera,
  modificarCaldera,
};
