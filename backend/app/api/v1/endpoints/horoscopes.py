from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, date
from ....database import get_db
from ....models.user import User
from ....models.horoscope import HoroscopeCache, ZodiacSign, HoroscopePeriod
from ....schemas.horoscope import HoroscopeResponse
from ....utils.security import get_current_user
from ....services.interpretation_engine import InterpretationEngine

router = APIRouter()


@router.get("/daily", response_model=HoroscopeResponse)
async def get_daily_horoscope(
    sign: ZodiacSign = Query(..., description="Zodiac sign"),
    date_param: date = Query(default_factory=date.today, alias="date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get daily horoscope for a zodiac sign."""
    # Check cache first
    result = await db.execute(
        select(HoroscopeCache).where(
            HoroscopeCache.sign == sign,
            HoroscopeCache.date == date_param,
            HoroscopeCache.period == HoroscopePeriod.DAILY
        )
    )
    cached_horoscope = result.scalar_one_or_none()

    if cached_horoscope:
        return HoroscopeResponse.model_validate(cached_horoscope)

    # Generate new horoscope
    horoscope_data = InterpretationEngine.generate_daily_horoscope(
        sign=sign.value,
        date=datetime.combine(date_param, datetime.min.time()),
        use_llm=False
    )

    # Create cache entry
    new_horoscope = HoroscopeCache(
        sign=sign,
        date=date_param,
        period=HoroscopePeriod.DAILY,
        content_text=horoscope_data["content"],
        mood=horoscope_data.get("mood"),
        keywords=horoscope_data.get("keywords"),
        lucky_color=horoscope_data.get("lucky_color"),
        lucky_number=horoscope_data.get("lucky_number")
    )

    db.add(new_horoscope)
    await db.commit()
    await db.refresh(new_horoscope)

    return HoroscopeResponse.model_validate(new_horoscope)


@router.get("/all-signs")
async def get_all_daily_horoscopes(
    date_param: date = Query(default_factory=date.today, alias="date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get daily horoscopes for all zodiac signs."""
    horoscopes = []

    for sign in ZodiacSign:
        # Check cache
        result = await db.execute(
            select(HoroscopeCache).where(
                HoroscopeCache.sign == sign,
                HoroscopeCache.date == date_param,
                HoroscopeCache.period == HoroscopePeriod.DAILY
            )
        )
        cached = result.scalar_one_or_none()

        if cached:
            horoscopes.append(HoroscopeResponse.model_validate(cached))
        else:
            # Generate
            horoscope_data = InterpretationEngine.generate_daily_horoscope(
                sign=sign.value,
                date=datetime.combine(date_param, datetime.min.time()),
                use_llm=False
            )

            new_horoscope = HoroscopeCache(
                sign=sign,
                date=date_param,
                period=HoroscopePeriod.DAILY,
                content_text=horoscope_data["content"],
                mood=horoscope_data.get("mood"),
                keywords=horoscope_data.get("keywords"),
                lucky_color=horoscope_data.get("lucky_color"),
                lucky_number=horoscope_data.get("lucky_number")
            )

            db.add(new_horoscope)
            horoscopes.append(HoroscopeResponse.model_validate(new_horoscope))

    await db.commit()

    return horoscopes
