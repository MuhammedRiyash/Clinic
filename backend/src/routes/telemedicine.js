const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const prisma = new PrismaClient();

// GET all telemedicine appointments
router.get('/', auth, async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { type: 'Telemedicine' },
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

// CREATE a new telemedicine session
router.post('/', auth, async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDate, reason, meetingLink } = req.body;
    
    // Generate a dummy meeting link if not provided
    const finalMeetingLink = meetingLink || `https://meet.tectraclinic.com/${Math.random().toString(36).substring(7)}`;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        reason,
        type: 'Telemedicine',
        meetingLink: finalMeetingLink,
        status: 'Scheduled'
      },
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true } }
      }
    });

    // Trigger Notification
    await prisma.notification.create({
      data: {
        title: 'New Virtual Session',
        message: `Telemedicine session scheduled with ${appointment.patient.name} for ${new Date(appointment.appointmentDate).toLocaleString()}.`,
        type: 'info'
      }
    });

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
