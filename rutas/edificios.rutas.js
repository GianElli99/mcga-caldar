const { Router } = require('express');
const {
  getEdificios,
  postEdificios,
  deleteEdificios,
  putEdificios,
  saludar,
} = require('../controladoras/edificios.controladoras');

const router = Router();

router.get('/', saludar, getEdificios);

router.post('/', postEdificios);

router.delete('/', deleteEdificios);

router.put('/', putEdificios);

module.exports = router;
