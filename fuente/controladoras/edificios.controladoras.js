const { request, response } = require('express');
const Edificio = require('../modelos/edificio');

const obtenerEdificios = (req = request, res = response) => {
  try {
    const { es_particular, ciudad } = req.query;

    if (
      es_particular &&
      (es_particular === 'true' || es_particular === 'false')
    ) {
      let particularBooleano = es_particular === 'true';
      Edificio = Edificio.filter(
        (edif) => edif.es_particular === particularBooleano
      );
    }

    if (ciudad) {
      Edificio = Edificio.filter((edif) =>
        edif.ciudad.toLowerCase().includes(ciudad.toLowerCase())
      );
    }

    res.send(Edificio);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerEdificio = (req = request, res = response) => {
  try {
    const edificioId = parseInt(req.params.id);
    const edificio = Edificio.find((edificio) => edificio.id === edificioId);

    if (edificio) {
      res.json(edificio);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const agregarEdificio = async (req = request, res = response) => {
  try {
    const Edificio = new Edificio(req.body);

    const existeEdificio = await Edificio.findOne({
      direccion: req.body.direccion,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal,
    });

    if (existeEdificio) {
      res.status(400).json({
        error: 'Ya existe un edificio en esa direccion, ciudad y codigo postal',
      });
    } else {
      await Edificio.save();
      res.status(201).json(Edificio);
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const modificarEdificio = async (req = request, res = response) => {
  try {
    const edificioId = req.params.id;

    const edificio = await Edificio.findByIdAndUpdate(edificioId, req.body, {
      new: true,
    });

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

    const edificio = await Edificio.findByIdAndDelete(edificioId);

    if (edificio) {
      res.json(Edificio);
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
