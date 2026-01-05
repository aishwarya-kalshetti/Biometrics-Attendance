# Biometrics Attendance System

A comprehensive web-based dashboard for analyzing and managing employee attendance data from biometric machines.

![Dashboard Preview](frontend/public/dashboard-preview.png)

## 🚀 Overview

This project is an **internal HR admin tool** designed to process raw punch-in/out data from Excel/CSV files and turn it into actionable insights. It replaces manual Excel reporting with a dynamic, visual dashboard.

## 🛠 Tech Stack

### Backend
- **Python (FastAPI)**: High-performance web API.
- **SQLite**: Lightweight, file-based database (no server installation required).
- **SQLAlchemy**: ORM for database management.
- **Pandas**: Efficient data processing for Excel imports.

### Frontend
- **React.js (Vite)**: Fast, modern UI library.
- **Lucide React**: Modern, clean icons.
- **Recharts**: Beautiful, responsive charts.
- **CSS Modules**: Modular styling.

---

## 💡 How It Works

### 1. Data Logic
The core logic resides in `backend/services/time_calculator.py`.

*   **Status Definition**:
    *   **PRESENT**: If an employee has **at least one** punch-in/out record for the day (regardless of total hours).
    *   **ABSENT**: If no punches exist for the day.
    *   **Minimum Hours**: Configurable in Settings (default: 6 hours). This setting separates "Present" from "Compliant".

*   **Compliance Calculation**:
    *   Formula: `(Actual Office Hours / Expected Hours) * 100`
    *   **Expected Hours** = `WFO Days * 8 hours` (e.g., if you work 2 days, expected is 16h).
    *   **Overtime**: Compliance can go above 100% if employees work more than expected.

*   **Thresholds (Configurable)**:
    *   🔴 **Below Target (< 70%)**: Needs improvement.
    *   🟡 **Meets Target (70% - 90%)**: Satisfactory.
    *   🟢 **Excellent (> 90%)**: Top performer.

### 2. The Workflow
1.  **HR Admin** uploads a raw biometric dump (Excel/CSV) via the "Upload Data" page.
2.  **Backend** parses the file:
    *   Skips invalid dates or missing employee codes.
    *   Merges new data with existing records (updates logic if data overlaps).
3.  **Dashboard** instantly updates to show:
    *   Total Employees & Attendance Trends.
    *   Compliance Charts (Pie & Bar).
    *   Week-wise filters.

### 3. Database
*   Data is stored in `backend/attendance.db` (SQLite).
*   This file is **persistent** (data remains after restart).
*   To **reset** the system: Delete `attendance.db` and restart the backend. A fresh, empty DB will be created.

---

## ⚙️ Setup & Installation

See the **[SETUP.md](SETUP.md)** file for detailed installation instructions.

### Quick Start
**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python3 main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```
├── backend/
│   ├── attendance.db       # Database file (generated)
│   ├── main.py             # Server entry point
│   ├── models/             # Database tables (Employee, DailyAttendance)
│   ├── routers/            # API endpoints (Upload, Reports, Settings)
│   └── services/           # Business logic (Calculator, Parser)
├── frontend/
│   ├── src/
│   │   ├── pages/          # Dashboard, All Employees, Settings
│   │   ├── components/     # Reusable UI parts
│   │   └── api/            # API connection logic
└── SETUP.md                # Installation guide
```

## 🔐 Security Note
*   The `attendance.db` file is listed in `.gitignore` to prevent uploading real employee data to public repositories.
*   New clones of this repo will start with an **empty database**.
