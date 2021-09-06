const { request, response } = require('express');
const path = require('path');
const fs = require('fs');

const obtenerClientes = (req = request, res = response) => {
  try {
    const { nombre } = req.query;
    let clientes = [];

    let edificiosParticulares = listarEdificios().filter(
      (edificio) => edificio.es_particular === true
    );

    clientes.push(...edificiosParticulares, ...listarConstructoras());

    if (nombre) {
      clientes = clientes.filter(
        (cliente) => cliente.nombre.toLowerCase() === nombre.toLowerCase()
      );
    }

    res.send(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const obtenerCliente = (req = request, res = response) => {
  try {
    const clienteId = parseInt(req.params.id);

    let clientes = [];
    let edificiosParticulares = listarEdificios().filter(
      (edificio) => edificio.es_particular === true
    );
    clientes.push(...edificiosParticulares, ...listarConstructoras());

    const cliente = clientes.find((cliente) => cliente.id === clienteId);

    if (cliente) {
      res.json(cliente);
    } else {
      res.json({});
    }
  } catch {
    res.status(500).json({ error: 'Un error ha ocurrido' });
  }
};

const listarConstructoras = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/constructoras.json')
  );
  let constructoras = JSON.parse(datosCrudos);

  return constructoras;
};

const listarEdificios = () => {
  let datosCrudos = fs.readFileSync(
    path.resolve(__dirname, '../datos/edificios.json')
  );
  let edificios = JSON.parse(datosCrudos);

  return edificios;
};

module.exports = {
  obtenerClientes,
  obtenerCliente,
};
