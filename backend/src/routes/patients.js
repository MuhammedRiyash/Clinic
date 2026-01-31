const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all patients
router.get('/', async (req, res, next) => {
  try {
    const { search, gender } = req.query;
    let where = {};
    
    if (search || gender) {
      where = {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } }
            ]
          } : {},
          gender && gender !== 'All' ? { gender: gender } : {}
        ]
      };
    }

    const patients = await prisma.patient.findMany({
      where,
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

    // Trigger Notification
    await prisma.notification.create({
      data: {
        title: 'New Patient Registered',
        message: `${newPatient.name} has been added to the system.`,
        type: 'success'
      }
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
