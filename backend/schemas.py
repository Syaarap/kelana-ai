from pydantic import BaseModel


class TripUpdate(BaseModel):
    budget: float


class TripResponse(BaseModel):
    id: int
    destination: str
    country: str
    days: int
    budget: float
    currency: str
    travel_month: str
    category: str
    style: str
    daily_budget: float
    season: str

    class Config:
        from_attributes = True