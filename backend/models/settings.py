"""
Application Settings Model
Stores dynamic configuration that can be changed by admin
"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base


class AppSettings(Base):
    """Dynamic application settings stored in database"""
    __tablename__ = "app_settings"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(50), unique=True, nullable=False, index=True)
    value = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Default settings keys
    EXPECTED_HOURS_PER_DAY = "expected_hours_per_day"
    WFO_DAYS_PER_WEEK = "wfo_days_per_week"
    WFH_DAYS_PER_WEEK = "wfh_days_per_week"
    THRESHOLD_RED = "threshold_red"
    THRESHOLD_AMBER = "threshold_amber"
    MIN_HOURS_FOR_PRESENT = "min_hours_for_present"  # Minimum hours to count as PRESENT
