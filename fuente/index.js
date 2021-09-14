const express = require('express');
const { json } = require('body-parser');

const routerCalderas = require('./rutas/calderas.rutas');
const routerEdificios = require('./rutas/edificios.rutas');
const routerConstructoras = require('./rutas/constructoras.rutas');
const routerTecnicos = require('./rutas/tecnicos.rutas');
const routerMantenimientosMensuales = require('./rutas/mantenimientos-mensuales.rutas');
const routerClientes = require('./rutas/clientes.rutas');
require('dotenv').config();
const { conectarBD } = require('./basededatos/configuracion');
const Tecnico = require('./modelos/tecnico');
const Mantenimiento = require('./modelos/mantenimiento');

const port = process.env.PORT || 8090;
const app = express();

app.use(json());

app.use('/tecnicos', routerTecnicos);
app.use('/calderas', routerCalderas);
app.use('/edificios', routerEdificios);
app.use('/constructoras', routerConstructoras);
app.use('/mantenimientos/mensuales', routerMantenimientosMensuales);
app.use('/clientes', routerClientes);

app.listen(port, async () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  await conectarBD();

  const tecnico = new Tecnico({
    nombre: 'Matias',
    apellido: 'Virgili',
    especializaciones: ['A', 'B', 'C'],
    telefono: '252146877',
    dni: '41635948',
    direccion: 'Salta 504',
  });
  await tecnico.save();
  const mantenimiento = new Mantenimiento({
    tipo: 'ASDFG',
    realizado: false,
    mes: 9,
    anio: 2021,
    tecnicoId: tecnico._id,
    calderaId: tecnico._id,
  });
  await mantenimiento.save({});
  console.log('guardado');
});
