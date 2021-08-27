const { Router } = require('express');
const {
  getEdificios,
  postEdificios,
  deleteEdificios,
  putEdificios,
} = require('../controladoras/edificios.controladoras');

const router = Router();

router.get('/', getEdificios);

router.post('/', postEdificios);

router.delete('/:id', deleteEdificios);

router.put('/', putEdificios);

module.exports = router;
