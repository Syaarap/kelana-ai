from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
)


def print_trip_summary(destination, days, budget, currency, travel_month):
    category = get_trip_category(budget)
    season = get_travel_season(travel_month)
    daily_budget = calculate_daily_budget(budget, days)
    places = get_recommended_places(destination)

    print("=" * 34)
    print("           KelanaAI")
    print("=" * 34)
    print(f"Destination     : {destination}")
    print(f"Days            : {days}")
    print(f"Budget          : {budget:.2f} {currency}")
    print(f"Category        : {category}")
    print(f"Daily Budget    : {daily_budget:.2f} {currency}/Day")
    print(f"Travel Month    : {travel_month}")
    print(f"Season          : {season}")
    print()
    print("Recommended Places")
    for place in places:
        print(f"- {place}")


def main():
    destination = input("Destination: ")
    country = input("Country: ")   # tetap diminta sebagai input
    days = int(input("Days: "))
    budget = float(input("Budget: "))
    currency = input("Currency: ")
    travel_month = input("Travel Month: ")

    print()
    print_trip_summary(destination, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()