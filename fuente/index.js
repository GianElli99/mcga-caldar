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
const Caldera = require('./modelos/caldera');
const Edificio = require('./modelos/edificio');

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

  const edificio = new Edificio({
    direccion: 'Lisandro de la Torre 671',
    ciudad: 'Montes de Oca',
    nombre: 'Los Alamos',
    codigoPostal: '2521',
    esParticular: true,
  });
  await edificio.save();
  const caldera = new Caldera({
    tipo: 'B',
    estaIntalada: false,
    tiempoMantenimientoMinutos: 200,
    edificioId: edificio._id,
  });
  await caldera.save();
  console.log('guardado');
});
