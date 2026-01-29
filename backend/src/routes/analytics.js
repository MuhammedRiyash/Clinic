const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfDay, endOfDay, subDays, subMonths, format, eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval, startOfMonth } = require('date-fns');

// Helper to format currency (not strictly needed here but useful context)
// Helper to group by interval
router.get('/cashflow', async (req, res, next) => {
  try {
    const { range } = req.query;
    const now = new Date();
    let startDate;
    let formatStr;
    let intervalFunc;

    switch (range) {
      case 'today':
        startDate = startOfDay(now);
        formatStr = 'HH:00';
        intervalFunc = () => eachHourOfInterval({ start: startDate, end: now });
        break;
      case '30days':
        startDate = subDays(now, 30);
        formatStr = 'MMM dd';
        intervalFunc = () => eachDayOfInterval({ start: startDate, end: now });
        break;
      case '6months':
        startDate = subMonths(now, 5); // Current + 5 previous
        formatStr = 'MMM';
        intervalFunc = () => eachMonthOfInterval({ start: startOfMonth(startDate), end: now });
        break;
      default: // 12months
        startDate = subMonths(now, 11);
        formatStr = 'MMM';
        intervalFunc = () => eachMonthOfInterval({ start: startOfMonth(startDate), end: now });
    }

    const billings = await prisma.billing.findMany({
      where: {
        status: 'Paid',
        invoiceDate: { gte: startDate }
      },
      select: { amount: true, invoiceDate: true }
    });

    const intervals = intervalFunc();
    const result = intervals.map(item => {
      const name = format(item, formatStr);
      let total = 0;

      if (range === 'today') {
        total = billings
          .filter(b => format(b.invoiceDate, 'HH') === format(item, 'HH'))
          .reduce((sum, b) => sum + b.amount, 0);
      } else if (range === '30days') {
        total = billings
          .filter(b => format(b.invoiceDate, 'yyyy-MM-dd') === format(item, 'yyyy-MM-dd'))
          .reduce((sum, b) => sum + b.amount, 0);
      } else {
        total = billings
          .filter(b => format(b.invoiceDate, 'yyyy-MM') === format(item, 'yyyy-MM'))
          .reduce((sum, b) => sum + b.amount, 0);
      }

      return { name, value: total };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
