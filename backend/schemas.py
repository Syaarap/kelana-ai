from pydantic import BaseModel


class UserRegister(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


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

