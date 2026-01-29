const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: z.enum(['Admin', 'Staff', 'Doctor']).optional().default('Staff'),
  imagePath: z.string().optional(),
});

// GET all (Admin only)
router.get('/', auth, adminOnly, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, imagePath: true, createdAt: true }
    });
    res.json(users);
  } catch (err) { next(err); }
});

// CREATE (Admin only)
router.post('/', auth, adminOnly, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imagePath = `/uploads/${req.file.filename}`;
    
    const validatedData = userSchema.parse(data);
    if (!validatedData.password) validatedData.password = 'Default123!'; // Default password
    
    validatedData.password = await bcrypt.hash(validatedData.password, 10);
    
    const user = await prisma.user.create({ data: validatedData });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

module.exports = router;
