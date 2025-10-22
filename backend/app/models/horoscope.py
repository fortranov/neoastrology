from sqlalchemy import Column, String, DateTime, Enum, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
import enum
from ..database import Base


class ZodiacSign(enum.Enum):
    ARIES = "aries"
    TAURUS = "taurus"
    GEMINI = "gemini"
    CANCER = "cancer"
    LEO = "leo"
    VIRGO = "virgo"
    LIBRA = "libra"
    SCORPIO = "scorpio"
    SAGITTARIUS = "sagittarius"
    CAPRICORN = "capricorn"
    AQUARIUS = "aquarius"
    PISCES = "pisces"


class HoroscopePeriod(enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class HoroscopeCache(Base):
    __tablename__ = "horoscope_cache"
    __table_args__ = (
        UniqueConstraint("sign", "date", "period", name="uq_sign_date_period"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    sign = Column(Enum(ZodiacSign), nullable=False, index=True)
    date = Column(DateTime(timezone=False), nullable=False, index=True)
    period = Column(Enum(HoroscopePeriod), nullable=False)

    content_text = Column(Text, nullable=False)
    mood = Column(String, nullable=True)  # e.g., "positive", "neutral", "challenging"
    keywords = Column(JSONB, nullable=True)  # Array of keywords
    lucky_color = Column(String, nullable=True)
    lucky_number = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
