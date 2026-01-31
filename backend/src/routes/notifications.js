const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// GET all notifications
router.get('/', auth, async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// MARK as read
router.put('/:id/read', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
});

// CREATE (internal use mostly)
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, message, type } = req.body;
    const notification = await prisma.notification.create({
      data: { title, message, type }
    });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
