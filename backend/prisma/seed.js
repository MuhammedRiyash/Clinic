const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'Admin',
    },
  });

  // 2. Create Doctors
  const doctors = [
    { name: 'Dr. Amit Mishra', specialty: 'Heart Surgeon', dob: new Date('1980-05-15'), email: 'amit@example.com', phone: '9988776655', status: 'Active' },
    { name: 'Dr. Sarah Smith', specialty: 'Dental Surgeon', dob: new Date('1985-08-22'), email: 'sarah@example.com', phone: '9988776644', status: 'Active' },
  ];

  for (const doc of doctors) {
    await prisma.doctor.upsert({ where: { email: doc.email }, update: {}, create: doc });
  }

  // 3. Create Patients
  const patients = [
    { name: 'John Doe', dob: new Date('1990-01-01'), gender: 'Male', email: 'john@example.com', phone: '1234567890', bloodGroup: 'O+' },
    { name: 'Jane Smith', dob: new Date('1992-05-10'), gender: 'Female', email: 'jane@example.com', phone: '0987654321', bloodGroup: 'A-' },
  ];

  for (const p of patients) {
    await prisma.patient.upsert({ where: { email: p.email }, update: {}, create: p });
  }

  // 4. Create Services
  const services = [
    { name: 'General Consultation', category: 'Medical', price: 500 },
    { name: 'Teeth Cleaning', category: 'Dental', price: 1200 },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  // 5. Create Inventory
  await prisma.inventory.createMany({
    data: [
      { itemName: 'Paracetamol', category: 'Medicine', quantity: 100, unitPrice: 10 },
      { itemName: 'Surgical Masks', category: 'Supplies', quantity: 500, unitPrice: 5 },
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
