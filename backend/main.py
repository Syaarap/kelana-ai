from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, Base, engine
from models import User, Trip

from schemas import (
    UserRegister,
    UserLogin,
    Token,
    TripUpdate,
    TripResponse,
)

from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_user_id_from_token,
)

from services.bedrock_service import generate_itinerary
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
)


# =========================
# DATABASE
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FASTAPI APP
# =========================

app = FastAPI()


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# AUTHENTICATION SECURITY
# =========================

security = HTTPBearer(
    scheme_name="BearerAuth",
    bearerFormat="JWT",
    description="Enter your JWT access token",
)


# =========================
# DATABASE DEPENDENCY
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# CURRENT USER
# =========================

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        return get_user_id_from_token(credentials.credentials)

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


# =========================
# AUTHENTICATION
# =========================

@app.post("/api/v1/register")
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )

    user = User(
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "username": user.username,
    }


@app.post("/api/v1/login", response_model=Token)
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if user is None or not verify_password(
        user_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================
# PUBLIC ENDPOINTS
# =========================

@app.get("/api/v1/recommendations")
def get_recommendations():
    return [
        "Tokyo Tower",
        "Mount Fuji",
        "Shibuya",
    ]


@app.get("/api/v1/transportations")
def get_transportations():
    return [
        "Bus",
        "Train",
        "Flight",
    ]


# =========================
# TRIP CRUD
# =========================

@app.post("/api/v1/trips", response_model=TripResponse)
def create_trip(
    destination: str,
    country: str,
    days: int,
    budget: float,
    currency: str,
    travel_month: str,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    category = get_trip_category(budget)

    season = get_travel_season(travel_month)

    daily_budget = calculate_daily_budget(
        budget,
        days,
    )

    trip = Trip(
        user_id=user_id,
        destination=destination,
        country=country,
        days=days,
        budget=budget,
        currency=currency,
        travel_month=travel_month,
        category=category,
        style="Solo",
        daily_budget=daily_budget,
        season=season,
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)

    return trip


@app.get("/api/v1/trips", response_model=list[TripResponse])
def get_trips(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .all()
    )


@app.get("/api/v1/trips/{id}", response_model=TripResponse)
def get_trip(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    trip = (
        db.query(Trip)
        .filter(
            Trip.id == id,
            Trip.user_id == user_id,
        )
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return trip


@app.post("/api/v1/trips/{id}/generate")
def generate_trip_recommendation(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this trip",
        )

    recommendation = generate_itinerary(
        destination=trip.destination,
        country=trip.country,
        days=trip.days,
        budget=trip.budget,
        currency=trip.currency,
        travel_month=trip.travel_month,
        category=trip.category,
        daily_budget=trip.daily_budget,
        season=trip.season,
    )

    trip.ai_recommendation = recommendation

    db.commit()
    db.refresh(trip)

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "ai_recommendation": trip.ai_recommendation,
    }


@app.put("/api/v1/trips/{id}", response_model=TripResponse)
def update_trip(
    id: int,
    trip_update: TripUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to modify this trip",
        )

    trip.budget = trip_update.budget

    trip.category = get_trip_category(
        trip_update.budget
    )

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
    user_id: int = Depends(get_current_user_id),
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    if trip.user_id != user_id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this trip",
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully"
    }