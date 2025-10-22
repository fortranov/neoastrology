from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID
from ....database import get_db
from ....models.user import User, SubscriptionTier
from ....models.natal_chart import NatalChart
from ....schemas.natal_chart import NatalChartCreate, NatalChartResponse
from ....utils.security import get_current_user, require_premium
from ....services.astro_calculator import AstroCalculatorService
from ....services.interpretation_engine import InterpretationEngine

router = APIRouter()


@router.post("", response_model=NatalChartResponse, status_code=status.HTTP_201_CREATED)
async def create_natal_chart(
    chart_data: NatalChartCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new natal chart."""
    # Check tier limits
    if current_user.subscription_tier == SubscriptionTier.FREE:
        # Count existing charts
        result = await db.execute(
            select(NatalChart).where(NatalChart.user_id == current_user.id)
        )
        existing_charts = result.scalars().all()

        if len(existing_charts) >= 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free tier allows only 1 natal chart. Upgrade to create more."
            )

    # Generate chart using astro calculator
    try:
        calculated_data = AstroCalculatorService.generate_natal_chart(
            birth_date=chart_data.birth_date,
            birth_time=chart_data.birth_time,
            birth_latitude=chart_data.birth_latitude,
            birth_longitude=chart_data.birth_longitude,
            birth_city=chart_data.birth_city,
            birth_timezone=chart_data.birth_timezone
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Generate interpretation
    use_llm = current_user.subscription_tier != SubscriptionTier.FREE
    interpretation = InterpretationEngine.interpret_natal_chart(
        chart_data=calculated_data,
        use_llm=use_llm,
        user_tier=current_user.subscription_tier.value
    )

    # Generate SVG (placeholder for now)
    svg_chart = AstroCalculatorService.generate_chart_svg(calculated_data)

    # Create chart record
    new_chart = NatalChart(
        user_id=current_user.id,
        name=chart_data.name,
        birth_date=chart_data.birth_date,
        birth_time=chart_data.birth_time,
        birth_timezone=chart_data.birth_timezone,
        birth_latitude=chart_data.birth_latitude,
        birth_longitude=chart_data.birth_longitude,
        birth_city=chart_data.birth_city,
        birth_country=chart_data.birth_country,
        chart_data=calculated_data,
        interpretation_text=interpretation,
        svg_chart=svg_chart,
        is_primary=chart_data.is_primary
    )

    db.add(new_chart)
    await db.commit()
    await db.refresh(new_chart)

    return NatalChartResponse.model_validate(new_chart)


@router.get("", response_model=List[NatalChartResponse])
async def get_user_charts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all charts for the current user."""
    result = await db.execute(
        select(NatalChart)
        .where(NatalChart.user_id == current_user.id)
        .order_by(NatalChart.created_at.desc())
    )
    charts = result.scalars().all()

    return [NatalChartResponse.model_validate(chart) for chart in charts]


@router.get("/{chart_id}", response_model=NatalChartResponse)
async def get_chart(
    chart_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific chart by ID."""
    result = await db.execute(
        select(NatalChart).where(
            NatalChart.id == chart_id,
            NatalChart.user_id == current_user.id
        )
    )
    chart = result.scalar_one_or_none()

    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )

    return NatalChartResponse.model_validate(chart)


@router.delete("/{chart_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chart(
    chart_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chart."""
    result = await db.execute(
        select(NatalChart).where(
            NatalChart.id == chart_id,
            NatalChart.user_id == current_user.id
        )
    )
    chart = result.scalar_one_or_none()

    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )

    await db.delete(chart)
    await db.commit()

    return None


@router.post("/{chart_id}/transits")
async def get_transits(
    chart_id: UUID,
    current_user: User = Depends(require_premium),
    db: AsyncSession = Depends(get_db)
):
    """Calculate transits for a chart (Premium feature)."""
    result = await db.execute(
        select(NatalChart).where(
            NatalChart.id == chart_id,
            NatalChart.user_id == current_user.id
        )
    )
    chart = result.scalar_one_or_none()

    if not chart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chart not found"
        )

    transits = AstroCalculatorService.calculate_transits(chart.chart_data)

    return transits
