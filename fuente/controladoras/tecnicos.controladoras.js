const { request, response } = require('express');
const Tecnico = require('../modelos/tecnico');

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
    // const {
    //   nombre = '',
    //   direccion = '',
    //   ciudad = '',
    //   telefono = '',
    //   especializacion = [],
    // } = req.body;

    // const tecnicoModificado = {
    //   id: tecnicoId,
    //   nombre,
    //   direccion,
    //   ciudad,
    //   telefono,
    //   especializacion,
    // };
    const tecnico = await Tecnico.findByIdAndUpdate(tecnicoId, req.body);

    // let tecnicos = listarTecnicos();
    // let modificacionRealizada = false;
    // for (let i = 0; i < tecnicos.length; i++) {
    //   if (tecnicoModificado.id === tecnicos[i].id) {
    //     tecnicos[i] = tecnicoModificado;
    //     modificacionRealizada = true;
    //     break;
    //   }
    // }
    if (tecnico) {
      res.json(tecnico);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const eliminarTecnico = async (req = request, res = response) => {
  try {
    const tecnicoId = req.params.id;

    const tecnico = await Tecnico.findByIdAndDelete(tecnicoId, req.body);

    res.json(tecnico);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

module.exports = {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
};
