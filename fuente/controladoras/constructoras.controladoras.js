const { request, response } = require('express');
const Constructora = require('../modelos/constructora');
const Edificio = require('../modelos/edificio');

const obtenerConstructoras = async (req = request, res = response) => {
  try {
    const { nombre, cuit, telefono } = req.query;

    let condicionesConstructora = {};
    if (nombre) {
      const regex = new RegExp(nombre, 'i');
      condicionesConstructora.nombre = { $regex: regex };
    }
    if (cuit) {
      const regex = new RegExp(cuit, 'i');
      condicionesConstructora.cuit = { $regex: regex };
    }
    if (telefono) {
      const regex = new RegExp(telefono, 'i');
      condicionesConstructora.telefono = { $regex: regex };
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

    if (!constructoraSeleccionada) {
      return res.status(400).json({ error: 'La constructora no existe' });
    }

    let edificios = await Edificio.find({ constructoraId: constructoraId });

    res.json(edificios);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const agregarConstructora = async (req = request, res = response) => {
  try {
    const constructora = new Constructora(req.body);
    // validar cuit unico
    await constructora.save();
    res.status(201).json(constructora);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarConstructora = async (req = request, res = response) => {
  try {
    const constructoraId = req.params.id;
    // validar cuit unico
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
