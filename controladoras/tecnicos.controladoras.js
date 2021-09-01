const { request, response } = require('express');
const fs = require('fs');

const obtenerTecnicos = (req = request, res = response) => {
  try {
    const { especializacion } = req.query;

    let tecnicos = listarTecnicos();

    if (especializacion) {
      tecnicos = tecnicos.filter((t) => t.especializacion === especializacion);
    }

    res.send(tecnicos);
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const obtenerTecnico = (req = request, res = response) => {
  try {
    const tecnicoId = parseInt(req.params.id);
    const tecnico = listarTecnicos().find(
      (tecnico) => tecnico.id === tecnicoId
    );

    if (tecnico) {
      res.json(tecnico);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const agregarTecnico = (req = request, res = response) => {
  const tecnicos = listarTecnicos();

  const nuevoTecnico = req.body;

  if (
    nuevoTecnico.id === null ||
    nuevoTecnico.nombre === null ||
    nuevoTecnico.direccion == null ||
    nuevoTecnico.telefono == null ||
    nuevoTecnico.especializacion === null
  ) {
    return res.status(401).json({ error: 'Datos ingresados incorrectos' });
  }

  tecnicos.push(nuevoTecnico);

  guardarTecnicos(tecnicos);
  res.status(201).json(nuevoTecnico);
};

const modificarTecnico = (req = request, res = response) => {
  try {
    const tecnicoId = parseInt(req.params.id);
    const tecnicoData = req.body;
    const tecnicos = listarTecnicos();

    const buscarTecnicoId = tecnicos.find((id) => id.tecnicoId === tecnicoId);
    if (buscarTecnicoId === undefined) {
      return res.status(409).send('No se encontro el tecnico con ese ID');
    }

    const actulizarTecnico = tecnicos.find((id) => id.tecnicoId === tecnicoId);

    actulizarTecnico.push(tecnicoData);

    guardarTecnicos(actulizarTecnico);
    res.status(200).json(tecnicoData);
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
};

const eliminarTecnico = (req = request, res = response) => {
  try {
    const tecnicoId = parseInt(req.params.id);
    let tecnicos = listarTecnicos();

    const tecnicoAEliminar = tecnicos.find(
      (tecnico) => tecnico.id === tecnicoId
    );

    if (tecnicoAEliminar) {
      tecnicos = tecnicos.filter((tecnico) => tecnico !== tecnicoAEliminar);
    }

    guardarTecnicos(tecnicos);

    res.json(tecnicoAEliminar);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const guardarTecnicos = (tecnicos) => {
  const guardarTecnicosData = JSON.stringify(tecnicos, null, 2);
  fs.writeFileSync('./datos/tecnicos.json', guardarTecnicosData);
};
const listarTecnicos = () => {
  let datosCrudos = fs.readFileSync('./datos/tecnicos.json');
  let tecnicos = JSON.parse(datosCrudos);

  return tecnicos;
};

module.exports = {
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
  agregarTecnico,
  modificarTecnico,
};
