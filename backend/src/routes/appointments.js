const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const prisma = new PrismaClient();

const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  appointmentDate: z.string().transform((str) => new Date(str)),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).optional().default('Scheduled'),
  type: z.enum(['In-person', 'Telemedicine']).optional().default('In-person'),
  meetingLink: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
});

// GET all appointments with relations
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const appointments = await prisma.appointment.findMany({
      where: search ? {
        OR: [
          { patient: { name: { contains: search } } },
          { doctor: { name: { contains: search } } },
          { reason: { contains: search } }
        ]
      } : {},
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
    const validatedData = appointmentSchema.parse(req.body);

    const newAppointment = await prisma.appointment.create({
      data: validatedData
    });
    res.status(201).json(newAppointment);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

// UPDATE appointment
router.put('/:id', async (req, res, next) => {
  try {
    const validatedData = appointmentSchema.partial().parse(req.body);

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: validatedData
    });
    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
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
