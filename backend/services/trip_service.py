def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"


def get_travel_season(month):
    month = month.lower()

    if month == "december":
        return "Peak Season"
    elif month == "june":
        return "Holiday Season"
    else:
        return "Regular Season"


def calculate_daily_budget(budget, days):
    return budget / days


def get_recommended_places(destination):
    destination = destination.lower()

    places = {
        "japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "indonesia": ["Bali", "Borobudur", "Raja Ampat"],
        "france": ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel"],
    }

    return places.get(destination, ["City Center", "Local Market", "Famous Landmark"])