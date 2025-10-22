from fastapi import APIRouter
from .endpoints import auth, charts, horoscopes

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(charts.router, prefix="/charts", tags=["charts"])
api_router.include_router(horoscopes.router, prefix="/horoscopes", tags=["horoscopes"])
