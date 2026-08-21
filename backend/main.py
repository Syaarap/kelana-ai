from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal, Base, engine
from models import Trip
from schemas import TripUpdate, TripResponse

from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
)


Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]

@app.post("/api/v1/trips", response_model=TripResponse)
def create_trip(
    destination: str,
    country: str,
    days: int,
    budget: float,
    currency: str,
    travel_month: str,
    db: Session = Depends(get_db),
):
    category = get_trip_category(budget)
    season = get_travel_season(travel_month)
    daily_budget = calculate_daily_budget(budget, days)

    trip = Trip(
        destination=destination,
        country=country,
        days=days,
        budget=budget,
        currency=currency,
        travel_month=travel_month,
        category=category,
        daily_budget=daily_budget,
        season=season,
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)

    return trip

@app.put("/api/v1/trips/{id}", response_model=TripResponse)
def update_trip(
    id: int,
    trip_update: TripUpdate,
    db: Session = Depends(get_db),
):
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    trip.budget = trip_update.budget
    trip.category = get_trip_category(trip_update.budget)
    trip.daily_budget = calculate_daily_budget(
        trip_update.budget,
        trip.days,
    )

    db.commit()
    db.refresh(trip)

    return trip


@app.delete("/api/v1/trips/{id}")
def delete_trip(
    id: int,
    db: Session = Depends(get_db),
):
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully"
    }