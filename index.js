const express = require('express');
const { json } = require('body-parser');
require('dotenv').config();

const routerCalderas = require('./rutas/calderas.rutas');
const routerEdificios = require('./rutas/edificios.rutas');
const routerConstructoras = require('./rutas/constructoras.rutas');

const port = process.env.PORT || 8090;
const app = express();

app.use(json());

app.use('/calderas', routerCalderas);
app.use('/edificios', routerEdificios);
app.use('/constructoras', routerConstructoras);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
