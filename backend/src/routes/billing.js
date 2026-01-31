const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all billing with relations
router.get('/', async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let where = {};
    
    if (search || status) {
      where = {
        AND: [
          search ? {
            OR: [
              { patient: { name: { contains: search, mode: 'insensitive' } } }
            ]
          } : {},
          status && status !== 'All' ? { status: status } : {}
        ]
      };
    }

    const billings = await prisma.billing.findMany({
      where,
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { invoiceDate: 'desc' }
    });
    res.json(billings);
  } catch (err) {
    next(err);
  }
});

// CREATE billing
router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.invoiceDate) data.invoiceDate = new Date(data.invoiceDate);

    const newBilling = await prisma.billing.create({
      data: data,
      include: { patient: { select: { name: true } } }
    });

    // Trigger Notification
    await prisma.notification.create({
      data: {
        title: 'New Billing Generated',
        message: `Invoice created for ${newBilling.patient.name} - Amount: ₹${newBilling.amount}.`,
        type: 'warning'
      }
    });

    res.status(201).json(newBilling);
  } catch (err) {
    next(err);
  }
});

// UPDATE billing
router.put('/:id', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.invoiceDate) data.invoiceDate = new Date(data.invoiceDate);

    const updated = await prisma.billing.update({
      where: { id: req.params.id },
      data: data
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE billing
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.billing.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
