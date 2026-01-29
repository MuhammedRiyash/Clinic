# 🏥 Tectra Clinic - Project Overview

Welcome to **Tectra Clinic**, a high-performance, professional-grade Clinic Management System. This platform is designed to streamline healthcare operations, manage patient lifecycles, and provide deep financial insights through advanced analytics.

---

## 🏛️ System Core
Tectra Clinic is built on a robust modern stack designed for speed, security, and scalability.

- **Frontend**: React with Vanilla CSS Modules for a sleek, premium, and unique design.
- **Backend**: Node.js & Express powering a high-speed REST API.
- **Database**: PostgreSQL/MySQL managed via Prisma ORM for type-safe data handling.
- **Analytics**: Custom-built temporal aggregation engine for real-time financial reporting.

---

## 🚀 Key Modules

### 📈 1. Advanced Financial Dashboard
The heart of Tectra Clinic. It transforms raw billing data into actionable insights.
- **Cashflow Analysis**: Toggle between **Today**, **30 Days**, and **12 Months** to see revenue trends.
- **Smart Formatting**: Financial axes use compact notation (e.g., ₹10K, ₹5.5L, ₹1Cr).
- **Smooth Visuals**: Monotone area charts with precision tooltips for a premium feel.

### 👥 2. Patient Management
Complete lifecycle tracking for clinical visitors.
- **Smart Directory**: Searchable list of all patients with quick-action modals.
- **ISO Standardized**: Ensures zero data-entry errors by using standardized ISO-8601 date handling.
- **Full CRUD**: Add, Edit, or Remove patient records instantly.

### 👨‍⚕️ 3. Doctor & Staffing
Manage your medical team with ease.
- **Profile Management**: Specialized image upload system with automatic avatar fallback.
- **Specialty Tracking**: Categorize doctors by neurosurgery, dental, heart surgery, etc.
- **Status Control**: Toggle between "Active" and "Inactive" staff members.

### 🗓️ 4. Appointment Scheduling
The operational pulse of the clinic.
- **Conflict-Free Booking**: Select patients and doctors with real-time availability checks.
- **Status Tracking**: Manage "Scheduled", "Completed", or "Cancelled" visits.
- **Metric Sync**: Appointments directly feed the "New Patients" and "Total Appointments" cards.

### 💳 5. Billing & Invoicing
The financial engine driving your revenue charts.
- **Instant Invoicing**: Generate professional bills with patient and service details.
- **Real-Time Dash Sync**: Marking a bill as "Paid" instantly reflects in the Cashflow and Income charts.
- **Payment Methods**: Support for Cash, Card, Insurance, and Online payments.

---

## ⚙️ Technical Highlights
- **Atomic Modals**: A unified form system used across the entire application for a consistent UX.
- **Robust Pathing**: Professional image handling that survives the production environment.
- **Schema Validation**: Uses **Zod** on the backend to ensure data integrity.

---

## 🛠️ How to Get Started

### Prerequisites
- Node.js (v18+)
- A MySQL or PostgreSQL database

### Installation
1.  **Clone & Install**:
    ```bash
    # Root directory
    npm run install-all # Custom script if available
    ```
2.  **Database Configuration**:
    Update `backend/.env` with your `DATABASE_URL` and `JWT_SECRET`.
3.  **Run Development Environment**:
    ```bash
    # Run both simultaneously (if configured)
    npm run dev
    ```

---

> [!TIP]
> **Pro Tip**: Use the "Today" range on the dashboard to monitor your clinic's performance hour-by-hour during peak operations.
