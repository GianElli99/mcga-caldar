const { request, response } = require('express');
const Mantenimiento = require('../modelos/mantenimiento');
const Tecnico = require('../modelos/tecnico');
const TiempoReservado = require('../modelos/tiempoReservado');

const obtenerTecnicos = async (req = request, res = response) => {
  try {
    const { especializaciones, nombre, estricto } = req.query;

    let condicionEspecializaciones = {};
    if (especializaciones.length > 0) {
      condicionEspecializaciones = {
        especializaciones: {
          $all: especializaciones,
        },
      };
      if (estricto) {
        condicionEspecializaciones.especializaciones.$size =
          especializaciones.length;
      }
    }

    const regex = new RegExp(nombre, 'i');

    const tecnicos = await Tecnico.find({
      ...condicionEspecializaciones,
      nombre: { $regex: regex },
    });
    res.send(tecnicos);
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const obtenerTecnico = async (req = request, res = response) => {
  try {
    const tecnicoId = req.params.id;
    const tecnico = await Tecnico.findById(tecnicoId);

    if (tecnico) {
      res.json(tecnico);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const agregarTecnico = async (req = request, res = response) => {
  try {
    const tecnico = new Tecnico(req.body);

    const existeTecnico = await Tecnico.findOne({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
    });

    if (existeTecnico) {
      res.status(400).json({
        error: 'Ya existe un técnico con el mismo nombre, apellido y dni',
      });
    } else {
      await tecnico.save();
      res.status(201).json(tecnico);
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const modificarTecnico = async (req = request, res = response) => {
  try {
    const tecnicoId = req.params.id;
    let tecnico;

    const existeTecnico = await Tecnico.findOne({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      dni: req.body.dni,
      _id: { $ne: tecnicoId },
    });

    if (existeTecnico) {
      return res.status(400).json({
        error: 'Ya existe un técnico con el mismo nombre, apellido y dni',
      });
    } else {
      tecnico = await Tecnico.findByIdAndUpdate(tecnicoId, req.body, {
        new: true,
      });
    }
    if (tecnico) {
      res.json(tecnico);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarTecnico = async (req = request, res = response) => {
  try {
    const tecnicoId = req.params.id;

    const poseeMantenimientos = Mantenimiento.findOne({ tecnicoId: tecnicoId });
    const poseeTiempoReservado = TiempoReservado.findOne({
      tecnicoId: tecnicoId,
    });

    if (poseeMantenimientos || poseeTiempoReservado) {
      return res.status(400).json({
        error:
          'No puede eliminar el técnico porque posee mantenimientos o tiempo reservado',
      });
    }

    const tecnico = await Tecnico.findByIdAndDelete(tecnicoId);

    if (tecnico) {
      res.json(tecnico);
    } else {
      res.status(404).json({ error: 'El recurso no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};
const obtenerTiempoReservadoDeTecnico = async (
  req = request,
  res = response
) => {
  try {
    const { id } = req.params;
    const fecha = new Date();

    const primerDiaMes = new Date(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth() + 1,
      1
    );
    const ultimoDiaMes = new Date(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth() + 2,
      0
    );
    const tecnico = await Tecnico.findById(id);
    if (!tecnico) {
      return res.status(400).json({
        error: 'El técnico no existe',
      });
    }

    const tiemposReservados = await TiempoReservado.find({
      tecnicoId: id,
      fecha: {
        $gte: primerDiaMes,
        $lt: ultimoDiaMes,
      },
    });

    res.json(tiemposReservados);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerTecnicos,
  obtenerTiempoReservadoDeTecnico,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
};
