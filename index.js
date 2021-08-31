const { json } = require('body-parser');
const express = require('express');

const routerEdificios = require('./rutas/edificios.rutas');

const app = express();
const PORT = 8090;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.use('/edificios', routerEdificios);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
