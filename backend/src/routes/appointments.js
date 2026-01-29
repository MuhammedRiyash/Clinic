const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all appointments with relations
router.get('/', async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { appointmentDate: 'desc' }
    });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// CREATE appointment
router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.appointmentDate) data.appointmentDate = new Date(data.appointmentDate);

    const newAppointment = await prisma.appointment.create({
      data: data
    });
    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
});

// UPDATE appointment
router.put('/:id', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.appointmentDate) data.appointmentDate = new Date(data.appointmentDate);

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: data
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE appointment
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
