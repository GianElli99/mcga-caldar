const { request, response } = require('express');
const Edificio = require('../modelos/edificio');
const Caldera = require('../modelos/caldera');

const obtenerEdificios = async (req = request, res = response) => {
  try {
    const { esParticular, direccion, constructoraId } = req.query;

    let condicionesFiltro = {};
    if (esParticular === true || esParticular === false) {
      condicionesFiltro.esParticular = esParticular;
    }
    if (direccion) {
      const regex = new RegExp(direccion, 'i');
      condicionesFiltro.direccion = { $regex: regex };
    }
    if (constructoraId) {
      condicionesFiltro.constructoraId = constructoraId;
    }

    const edificios = await Edificio.find(condicionesFiltro);

    res.json(edificios);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificio = async (req = request, res = response) => {
  try {
    const edificioId = req.params.id;
    const edificio = await Edificio.findById(edificioId);

    if (edificio) {
      res.json(edificio);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const agregarEdificio = async (req = request, res = response) => {
  try {
    const edificio = new Edificio(req.body);

    const existeEdificio = await Edificio.findOne({
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      codigoPostal: req.body.codigoPostal,
    });
    if (edificio.esParticular) {
      edificio.constructoraId = undefined;
    }

    if (existeEdificio) {
      res.status(400).json({
        error: 'Ya existe un edificio en esa direccion, ciudad y codigo postal',
      });
    } else {
      await edificio.save();
      res.status(201).json(edificio);
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarEdificio = async (req = request, res = response) => {
  try {
    const edificioId = req.params.id;
    let edificio = req.body;

    const existeEdificio = await Edificio.findOne({
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      codigoPostal: req.body.codigoPostal,
      _id: { $ne: edificioId },
    });
    if (edificio.esParticular) {
      edificio.constructoraId = undefined;
    }

    if (existeEdificio) {
      return res.status(400).json({
        error: 'Ya existe un edificio en esa direccion, ciudad y codigo postal',
      });
    } else {
      edificio = await Edificio.findByIdAndUpdate(edificioId, edificio, {
        new: true,
      });
    }
    if (edificio) {
      res.json(edificio);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarEdificio = async (req = request, res = response) => {
  try {
    const edificioId = req.params.id;

    const poseeCaldera = await Caldera.findOne({ edificioId: edificioId });

    if (poseeCaldera) {
      return res.status(400).json({
        error: 'No puede eliminar el edificio porque posee una caldera',
      });
    }

    const edificio = await Edificio.findByIdAndDelete(edificioId);

    if (edificio) {
      res.json(edificio);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerEdificios,
  obtenerEdificio,
  agregarEdificio,
  eliminarEdificio,
  modificarEdificio,
};
