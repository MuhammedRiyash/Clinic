const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all services
router.get('/', async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// CREATE service
router.post('/', async (req, res, next) => {
  try {
    const newService = await prisma.service.create({
      data: req.body
    });
    res.status(201).json(newService);
  } catch (err) {
    next(err);
  }
});

// UPDATE service
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE service
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
