const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all patients
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const patients = await prisma.patient.findMany({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    });
    res.json(patients);
  } catch (err) {
    next(err);
  }
});

// CREATE patient
router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.dob) data.dob = new Date(data.dob);
    
    const newPatient = await prisma.patient.create({
      data: data
    });
    res.status(201).json(newPatient);
  } catch (err) {
    next(err);
  }
});

// UPDATE patient
router.put('/:id', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.dob) data.dob = new Date(data.dob);

    const updatedPatient = await prisma.patient.update({
      where: { id: req.params.id },
      data: data
    });
    res.json(updatedPatient);
  } catch (err) {
    next(err);
  }
});

// DELETE patient
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.patient.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
