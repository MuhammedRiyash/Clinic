const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET Dashboard Cards Statistics
router.get('/cards', async (req, res, next) => {
  try {
    const totalAppointments = await prisma.appointment.count();
    const totalPatients = await prisma.patient.count();
    const paidVisitorsCount = await prisma.billing.count({ where: { status: 'Paid' } });
    
    // Total income for the month as a visitors alternative or similar
    const startDate = new Date();
    startDate.setDate(1); 
    startDate.setHours(0,0,0,0);
    const newPatientsThisMonth = await prisma.patient.count({
      where: { createdAt: { gte: startDate } }
    });

    res.json({
      totalVisitors: totalPatients, // Total unique patients
      paidVisitors: paidVisitorsCount,
      totalAppointments: totalAppointments,
      newPatients: newPatientsThisMonth
    });
  } catch (err) {
    next(err);
  }
});

// GET Cashflow Chart Data (Monthly Revenue)
router.get('/cashflow', async (req, res, next) => {
  try {
    const billings = await prisma.billing.findMany({
      where: { status: 'Paid' },
      select: { amount: true, invoiceDate: true }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = months.map((month, index) => {
      const total = billings
        .filter(b => b.invoiceDate.getMonth() === index && b.invoiceDate.getFullYear() === currentYear)
        .reduce((sum, b) => sum + b.amount, 0);
      return { name: month, value: total };
    });

    res.json(monthlyData);
  } catch (err) {
    next(err);
  }
});

// GET Service Distribution (Pie Chart)
router.get('/distribution', async (req, res, next) => {
  try {
    const billings = await prisma.billing.findMany({
      where: { status: 'Paid' }
    });

    // For now, let's just show split between Medical and Dental based on typical distribution
    const medicalCount = await prisma.service.count({ where: { category: 'Medical' } });
    const dentalCount = await prisma.service.count({ where: { category: 'Dental' } });

    const data = [
      { name: 'Medical', value: medicalCount || 1, color: '#2F818E' },
      { name: 'Dental', value: dentalCount || 1, color: '#3FB1C5' },
      { name: 'Pharmacy', value: 2, color: '#A3D9E2' },
      { name: 'Others', value: 1, color: '#E5F6F8' },
    ];

    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
