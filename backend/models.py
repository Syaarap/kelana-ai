from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)

    trips = relationship("Trip", back_populates="user")
    messages = relationship("ChatMessage", back_populates="user")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    destination = Column(String, nullable=False)
    country = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    currency = Column(String, nullable=False)
    travel_month = Column(String, nullable=False)
    category = Column(String, nullable=False)
    style = Column(String, nullable=False, default="Solo")
    daily_budget = Column(Float, nullable=False)
    season = Column(String, nullable=False)
    ai_recommendation = Column(Text, nullable=True)

    user = relationship("User", back_populates="trips")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user = relationship("User", back_populates="messages")