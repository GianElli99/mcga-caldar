const { json } = require('body-parser');
const express = require('express');
const app = express();
const PORT = 8090;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hi!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
