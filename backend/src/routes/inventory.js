const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { auth, adminOnly } = require('../middleware/auth');

const prisma = new PrismaClient();

const inventorySchema = z.object({
  itemName: z.string().min(2),
  category: z.string(),
  quantity: z.number().int().min(0),
  unitPrice: z.number().min(0),
  expiryDate: z.string().optional().transform((str) => str ? new Date(str) : null),
  supplier: z.string().optional(),
});

// GET all
router.get('/', auth, async (req, res, next) => {
  try {
    const items = await prisma.inventory.findMany({ orderBy: { itemName: 'asc' } });
    res.json(items);
  } catch (err) { next(err); }
});

// CREATE (Admin/Staff)
router.post('/', auth, async (req, res, next) => {
  try {
    const validatedData = inventorySchema.parse(req.body);
    const item = await prisma.inventory.create({ data: validatedData });
    res.status(201).json(item);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

module.exports = router;
