from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class HoroscopeResponse(BaseModel):
    sign: str
    date: datetime
    period: str
    content_text: str
    mood: Optional[str]
    keywords: Optional[List[str]]
    lucky_color: Optional[str]
    lucky_number: Optional[str]

    class Config:
        from_attributes = True
