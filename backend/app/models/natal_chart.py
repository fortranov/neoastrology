from sqlalchemy import Column, String, DateTime, Boolean, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from ..database import Base


class NatalChart(Base):
    __tablename__ = "natal_charts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    name = Column(String, nullable=False)  # Name for this chart (e.g., "Моя карта")

    # Birth data
    birth_date = Column(DateTime(timezone=False), nullable=False)
    birth_time = Column(String, nullable=False)  # HH:MM format
    birth_timezone = Column(String, nullable=False)  # e.g., "Europe/Moscow"
    birth_latitude = Column(Float, nullable=False)
    birth_longitude = Column(Float, nullable=False)
    birth_city = Column(String, nullable=False)
    birth_country = Column(String, nullable=False)

    # Calculated data
    chart_data = Column(JSONB, nullable=True)  # Full chart data (planets, houses, aspects)
    interpretation_text = Column(Text, nullable=True)  # Generated interpretation
    svg_chart = Column(Text, nullable=True)  # SVG representation

    is_primary = Column(Boolean, default=False, nullable=False)  # User's main chart

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    # Relationships
    user = relationship("User", back_populates="charts")
