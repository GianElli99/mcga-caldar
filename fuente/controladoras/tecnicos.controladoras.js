const { request, response } = require('express');
const fs = require('fs');
const path = require('path');
const Tecnico = require('../modelos/tecnico');

const obtenerTecnicos = async (req = request, res = response) => {
  try {
    const { especializaciones, nombre, estricto } = req.query;
    const especializacionesArray = especializaciones.toUpperCase().split(',');

    let condicionEspecializaciones = {};
    if (especializacionesArray.length > 0) {
      condicionEspecializaciones = {
        especializaciones: {
          $all: especializacionesArray,
        },
      };
      if (estricto === 'true') {
        condicionEspecializaciones.especializaciones.$size =
          especializacionesArray.length;
      }
    }

    const regex = new RegExp(nombre, 'i');

    const tecnicos = await Tecnico.find({
      ...condicionEspecializaciones,
      nombre: { $regex: regex },
    });
    res.send(tecnicos);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerTecnico = async (req = request, res = response) => {
  try {
    const tecnicoId = req.params.id;
    const tecnico = await Tecnico.findById(tecnicoId);

    if (tecnico) {
      res.json(tecnico);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const agregarTecnico = async (req = request, res = response) => {
  const { nombre, apellido, especializaciones, telefono, dni, direccion } =
    req.body;
  const tecnico = new Tecnico({
    nombre,
    apellido,
    especializaciones,
    telefono,
    dni,
    direccion,
  });

  await tecnico.save();

  // if (
  //   nuevoTecnico.nombre === null ||
  //   nuevoTecnico.apellido === null ||
  //   nuevoTecnico.direccion == null ||
  //   nuevoTecnico.telefono == null ||
  //   nuevoTecnico.especializacion === null
  // ) {
  //   return res.status(401).json({ error: 'Datos ingresados incorrectos' });
  // }

  res.status(201).json(tecnico);
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
