from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, date, time
from uuid import UUID


class NatalChartCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    birth_date: date
    birth_time: str = Field(..., pattern=r"^\d{2}:\d{2}$")  # HH:MM format
    birth_timezone: str
    birth_latitude: float = Field(..., ge=-90, le=90)
    birth_longitude: float = Field(..., ge=-180, le=180)
    birth_city: str
    birth_country: str
    is_primary: bool = False


class NatalChartResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    birth_date: datetime
    birth_time: str
    birth_timezone: str
    birth_latitude: float
    birth_longitude: float
    birth_city: str
    birth_country: str
    chart_data: Optional[Dict[str, Any]]
    interpretation_text: Optional[str]
    svg_chart: Optional[str]
    is_primary: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
