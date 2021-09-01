const { json } = require('body-parser');
const express = require('express');
const routerTecnicos = require('./rutas/tecnicos.rutas');
const app = express();
const PORT = 8090;

app.use(json());

app.use('/tecnicos', routerTecnicos);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
