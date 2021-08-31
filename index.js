const express = require('express');
const { json } = require('body-parser');

const routerCalderas = require('./rutas/calderas.rutas');
const routerEdificios = require('./rutas/edificios.rutas');

const PORT = 8090;
const app = express();

app.use(json());

app.use('/calderas', routerCalderas);
app.use('/edificios', routerEdificios);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
