from database import Base, engine
from models import Trip


Base.metadata.create_all(bind=engine)

print("Tabel berhasil dibuat!")