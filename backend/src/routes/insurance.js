const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// GET all insurance policies
router.get('/', auth, async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let where = {};
    
    if (search || status) {
      where = {
        AND: [
          search ? {
            OR: [
              { providerName: { contains: search, mode: 'insensitive' } },
              { policyNumber: { contains: search, mode: 'insensitive' } }
            ]
          } : {},
          status && status !== 'All' ? { status: status } : {}
        ]
      };
    }

    const policies = await prisma.insurance.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(policies);
  } catch (err) {
    next(err);
  }
});

// CREATE insurance policy
router.post('/', auth, async (req, res, next) => {
  try {
    const { policyNumber, providerName, coverageType, validUntil, patientId, status } = req.body;
    
    const policy = await prisma.insurance.create({
      data: {
        policyNumber,
        providerName,
        coverageType,
        validUntil: new Date(validUntil),
        patientId,
        status: status || 'Active'
      }
    });

    // Trigger Notification
    await prisma.notification.create({
      data: {
        title: 'New Insurance Linked',
        message: `Policy ${policyNumber} has been linked for patient.`,
        type: 'info'
      }
    });

    res.status(201).json(policy);
  } catch (err) {
    next(err);
  }
});

// UPDATE insurance policy
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { policyNumber, providerName, coverageType, validUntil, status } = req.body;
    const updated = await prisma.insurance.update({
      where: { id: req.params.id },
      data: {
        policyNumber,
        providerName,
        coverageType,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        status
      }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE insurance policy
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await prisma.insurance.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
