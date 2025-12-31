"""
Settings Router
Handles settings API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict
from pydantic import BaseModel

from database import get_db
from models.settings import AppSettings
from config import settings as default_settings

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingsUpdate(BaseModel):
    """Request model for updating settings"""
    expected_hours_per_day: int = 8
    wfo_days_per_week: int = 2
    wfh_days_per_week: int = 3
    threshold_red: int = 70
    threshold_amber: int = 90
    min_hours_for_present: int = 6  # Minimum hours to count as PRESENT


def get_setting_value(db: Session, key: str, default: str) -> str:
    """Get a setting value from database or return default"""
    setting = db.query(AppSettings).filter(AppSettings.key == key).first()
    return setting.value if setting else default


def set_setting_value(db: Session, key: str, value: str) -> None:
    """Set a setting value in database"""
    setting = db.query(AppSettings).filter(AppSettings.key == key).first()
    if setting:
        setting.value = value
    else:
        setting = AppSettings(key=key, value=value)
        db.add(setting)


@router.get("")
async def get_settings(db: Session = Depends(get_db)) -> Dict:
    """
    Get all application settings
    """
    expected_hours = int(get_setting_value(
        db, AppSettings.EXPECTED_HOURS_PER_DAY, 
        str(default_settings.EXPECTED_HOURS_PER_DAY)
    ))
    wfo_days = int(get_setting_value(
        db, AppSettings.WFO_DAYS_PER_WEEK, 
        str(default_settings.WFO_DAYS_PER_WEEK)
    ))
    wfh_days = int(get_setting_value(
        db, AppSettings.WFH_DAYS_PER_WEEK, 
        str(default_settings.WFH_DAYS_PER_WEEK)
    ))
    threshold_red = int(get_setting_value(
        db, AppSettings.THRESHOLD_RED, 
        str(default_settings.THRESHOLD_RED)
    ))
    threshold_amber = int(get_setting_value(
        db, AppSettings.THRESHOLD_AMBER, 
        str(default_settings.THRESHOLD_AMBER)
    ))
    min_hours = int(get_setting_value(
        db, AppSettings.MIN_HOURS_FOR_PRESENT, 
        "6"  # Default 6 hours
    ))
    
    return {
        "expected_hours_per_day": expected_hours,
        "wfo_days_per_week": wfo_days,
        "wfh_days_per_week": wfh_days,
        "expected_weekly_minutes": wfo_days * expected_hours * 60,
        "min_hours_for_present": min_hours,
        "thresholds": {
            "red": threshold_red,
            "amber": threshold_amber
        }
    }


@router.put("")
async def update_settings(
    settings_data: SettingsUpdate,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Update application settings
    """
    set_setting_value(db, AppSettings.EXPECTED_HOURS_PER_DAY, str(settings_data.expected_hours_per_day))
    set_setting_value(db, AppSettings.WFO_DAYS_PER_WEEK, str(settings_data.wfo_days_per_week))
    set_setting_value(db, AppSettings.WFH_DAYS_PER_WEEK, str(settings_data.wfh_days_per_week))
    set_setting_value(db, AppSettings.THRESHOLD_RED, str(settings_data.threshold_red))
    set_setting_value(db, AppSettings.THRESHOLD_AMBER, str(settings_data.threshold_amber))
    set_setting_value(db, AppSettings.MIN_HOURS_FOR_PRESENT, str(settings_data.min_hours_for_present))
    
    db.commit()
    
    return {
        "message": "Settings updated successfully",
        "settings": {
            "expected_hours_per_day": settings_data.expected_hours_per_day,
            "wfo_days_per_week": settings_data.wfo_days_per_week,
            "wfh_days_per_week": settings_data.wfh_days_per_week,
            "min_hours_for_present": settings_data.min_hours_for_present,
            "thresholds": {
                "red": settings_data.threshold_red,
                "amber": settings_data.threshold_amber
            }
        }
    }


# Helper function for other services to get settings
def get_dynamic_settings(db: Session) -> Dict:
    """Get settings as a dictionary for use in calculations"""
    expected_hours = int(get_setting_value(
        db, AppSettings.EXPECTED_HOURS_PER_DAY, 
        str(default_settings.EXPECTED_HOURS_PER_DAY)
    ))
    wfo_days = int(get_setting_value(
        db, AppSettings.WFO_DAYS_PER_WEEK, 
        str(default_settings.WFO_DAYS_PER_WEEK)
    ))
    threshold_red = int(get_setting_value(
        db, AppSettings.THRESHOLD_RED, 
        str(default_settings.THRESHOLD_RED)
    ))
    threshold_amber = int(get_setting_value(
        db, AppSettings.THRESHOLD_AMBER, 
        str(default_settings.THRESHOLD_AMBER)
    ))
    min_hours = int(get_setting_value(
        db, AppSettings.MIN_HOURS_FOR_PRESENT, 
        "6"
    ))
    
    return {
        "expected_hours_per_day": expected_hours,
        "wfo_days_per_week": wfo_days,
        "threshold_red": threshold_red,
        "threshold_amber": threshold_amber,
        "min_hours_for_present": min_hours
    }
