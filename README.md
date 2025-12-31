# Biometrics Attendance HR System

A production-ready, admin-only web application that processes fingerprint biometric attendance data and generates automated, real-time HR attendance reports.

![Dashboard Preview](docs/dashboard-preview.png)

## 🎯 Features

- **Data Import**: Upload biometric attendance logs (CSV/Excel)
- **Automatic Calculations**: IN/OUT pairing, daily totals, weekly aggregation
- **Hybrid Work Support**: Configurable WFO/WFH policy
- **Color-Coded Reports**: RED (<70%), AMBER (70-90%), GREEN (>90%)
- **Multiple Reports**:
  - Individual Employee Report
  - All Employees Summary
  - WFO Compliance Report
- **Export**: Download reports as CSV

## 🛠 Technology Stack

- **Frontend**: React + Vite
- **Backend**: Python FastAPI
- **Database**: SQLite (can be migrated to MySQL)
- **Charts**: Recharts

## 📁 Project Structure

```
Biometrics Attendence/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── services/            # Business logic
│   └── routers/             # API endpoints
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # Reusable components
│   │   └── pages/           # Page components
│   └── index.html
│
└── sample_data/
    └── biometric_export.csv # Sample test data
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/` | Upload attendance file |
| GET | `/api/employees/` | List all employees |
| GET | `/api/reports/dashboard` | Dashboard summary |
| GET | `/api/reports/all-employees` | All employees report |
| GET | `/api/reports/individual/{code}` | Individual report |
| GET | `/api/reports/wfo-compliance` | WFO compliance report |
| GET | `/api/reports/export/*` | Export reports as CSV |

## ⚙️ Configuration

The default hybrid work policy settings:

| Setting | Default Value |
|---------|---------------|
| Expected hours per WFO day | 8 hours |
| WFO days per week | 2 days |
| WFH days per week | 3 days |
| RED threshold | <70% |
| AMBER threshold | 70-90% |
| GREEN threshold | >90% |

These can be modified in `backend/config.py` or via the Settings page.

## 📝 Data Format

The system accepts CSV/Excel files with the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| DATE | Yes | Date (DD/MM/YYYY) |
| CODE | Yes | Employee ID |
| NAME | Yes | Employee name |
| IN | Yes | Clock-in time (HH:MM) |
| OUT | Yes | Clock-out time (HH:MM) |
| TOTAL | No | Total hours (HH:MM:SS) |
| SHIFT | No | Shift number |
| LATE | No | Late indicator |
| OT | No | Overtime |
| REMARK | No | A=Absent, P=Present |

## 🎨 Color Status Legend

| Color | Range | Meaning |
|-------|-------|---------|
| 🔴 RED | <70% | Below Expectation |
| 🟡 AMBER | 70-90% | Meets Expectation |
| 🟢 GREEN | >90% | Excellent |

## 📱 Screenshots

### Dashboard
Modern dashboard with summary cards, compliance charts, and employee overview.

### Upload Data
Drag-and-drop file upload with format validation and processing feedback.

### All Employees Report
Filterable and sortable table with color-coded compliance status.

### WFO Compliance Report
Detailed hybrid work policy compliance tracking.

## 🔒 Security

This is an admin-only internal tool. Authentication is not implemented in this version but can be added:

1. Add FastAPI JWT authentication
2. Implement login page in React
3. Protect all routes with auth middleware

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📄 License

MIT License - feel free to use this project for your organization's HR attendance management.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for HR teams managing hybrid workforces.
