const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// GET contacts (users in the system)
router.get('/contacts', auth, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { id: { not: req.user.id } },
      select: { id: true, name: true, role: true, imagePath: true }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET messages for a specific conversation
router.get('/:otherUserId', auth, async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// SEND a message
router.post('/', auth, async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content
      }
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
