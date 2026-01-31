const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const upload = require('../middleware/upload');

const prisma = new PrismaClient();

// Validation Schema
const doctorSchema = z.object({
  name: z.string().min(2).max(100),
  specialty: z.string().min(2).max(100),
  dob: z.string().transform((str) => new Date(str)),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
  imagePath: z.string().optional(),
});

// GET all doctors
router.get('/', async (req, res, next) => {
  try {
    const { search, specialty } = req.query;
    
    let where = {};
    
    if (search || specialty) {
      where = {
        AND: [
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { specialty: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          } : {},
          specialty && specialty !== 'All' ? { specialty: specialty } : {}
        ]
      };
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(doctors);
  } catch (err) {
    next(err);
  }
});

// GET single doctor
router.get('/:id', async (req, res, next) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id }
    });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    next(err);
  }
});

// CREATE doctor
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imagePath = `/uploads/${req.file.filename}`;
    }
    const validatedData = doctorSchema.parse(data);
    const newDoctor = await prisma.doctor.create({
      data: validatedData
    });
    res.status(201).json(newDoctor);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
});

// UPDATE doctor
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imagePath = `/uploads/${req.file.filename}`;
    }
    const validatedData = doctorSchema.partial().parse(data);
    const updatedDoctor = await prisma.doctor.update({
      where: { id: req.params.id },
      data: validatedData
    });
    res.json(updatedDoctor);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
});

// DELETE doctor
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.doctor.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
