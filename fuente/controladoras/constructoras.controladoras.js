const { request, response } = require('express');
const Constructora = require('../modelos/constructora');
const Edificio = require('../modelos/edificio');

const obtenerConstructoras = async (req = request, res = response) => {
  try {
    const { nombre, cuit, telefono } = req.query;

    let condicionesConstructora = {};
    if (nombre) {
      condicionesConstructora.nombre = nombre;
    }
    if (cuit) {
      condicionesConstructora.cuit = cuit;
    }
    if (telefono) {
      condicionesConstructora.telefono = telefono;
    }

    const constructoras = await Constructora.find(condicionesConstructora);
    res.send(constructoras);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerConstructora = async (req = request, res = response) => {
  try {
    const constructoraId = req.params.id;

    const constructora = await Constructora.findById(constructoraId);

    if (constructora) {
      res.send(constructora);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificios = async (req = request, res = response) => {
  try {
    const constructoraId = req.params.id;
    const constructoraSeleccionada = await Constructora.findById(
      constructoraId
    );

    let edificios = await Edificio.find(constructoraSeleccionada);

    if (edificios) {
      res.json(edificios.nombre + edificios.direccion);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const agregarConstructora = async (req = request, res = response) => {
  try {
    const constructora = new Constructora(req.body);

    await constructora.save();
    res.status(201).json(constructora);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarConstructora = async (req = request, res = response) => {
  try {
    const constructoraId = req.params.id;

    const constructora = await Constructora.findByIdAndUpdate(
      constructoraId,
      req.body,
      { new: true }
    );

    if (constructora) {
      res.send(constructora);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarConstructora = async (req = request, res = response) => {
  try {
    const constructoraId = req.params.id;

    const edificio = await Edificio.findOne({ constructoraId });

    if (edificio) {
      return res.json({ error: 'No se puede eliminar esta constructora' });
    } else {
      const constructora = await Constructora.findByIdAndDelete(constructoraId);
      if (constructora) {
        res.json(constructora);
      } else {
        res.status(404).json({ error: 'El recurso no existe' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerConstructoras,
  obtenerConstructora,
  agregarConstructora,
  eliminarConstructora,
  modificarConstructora,
  obtenerEdificios,
};
