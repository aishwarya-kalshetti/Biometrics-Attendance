"""
Employee model for the Biometrics Attendance System
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


class Employee(Base):
    """Employee model representing company employees"""
    
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    department = Column(String(50), nullable=True)
    required_wfo_days = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    attendance_logs = relationship("AttendanceLog", back_populates="employee")
    daily_summaries = relationship("DailyAttendance", back_populates="employee")
    weekly_summaries = relationship("WeeklySummary", back_populates="employee")
    
    def __repr__(self):
        return f"<Employee(code={self.code}, name={self.name})>"
