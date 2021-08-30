const express = require('express');
const { json } = require('body-parser');
const routerCalderas = require('./rutas/calderas.rutas');

const app = express();
const PORT = 8090;

app.use(json());
app.use('/calderas', routerCalderas);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
