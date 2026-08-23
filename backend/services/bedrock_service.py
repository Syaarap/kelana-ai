import boto3


REGION = "us-east-1"
MODEL_ID = "us.meta.llama3-3-70b-instruct-v1:0"

bedrock_runtime = boto3.client(
    "bedrock-runtime",
    region_name=REGION,
)


def generate_itinerary(
    destination: str,
    country: str,
    days: int,
    budget: float,
    currency: str,
    travel_month: str,
    category: str,
    daily_budget: float,
    season: str,
):
    prompt = f"""
You are KelanaAI, an expert travel itinerary planner.

Create a structured daily travel plan based on the following trip information:

Destination: {destination}
Country: {country}
Duration: {days} days
Total Budget: {budget} {currency}
Daily Budget: {daily_budget:.2f} {currency}
Travel Month: {travel_month}
Trip Category: {category}
Travel Season: {season}

IMPORTANT REQUIREMENTS:

For EVERY day:

MORNING:
- Provide exactly 2-3 specific morning activities.
- Include practical activities such as sightseeing, breakfast, walking, or visiting attractions.

AFTERNOON:
- Include at least one cultural site or cultural attraction.
- Include at least one authentic local experience when appropriate.

EVENING:
- Recommend a suitable dinner spot or type of local food experience.
- Suggest an evening entertainment or nightlife activity that is appropriate for the destination.

GENERAL RULES:
- Organize the response clearly by Day 1, Day 2, etc.
- Keep activities realistic for the destination.
- Consider reasonable travel time between locations.
- Keep recommendations appropriate for the stated budget.
- Avoid scheduling too many distant locations on the same day.
- Give concise explanations for important activities.
- Do not invent exact prices if you are uncertain.
- Do not include information unrelated to the itinerary.

Use this format:

Day 1: [Theme]

Morning:
- Activity 1
- Activity 2
- Activity 3

Afternoon:
- Cultural site:
- Local experience:

Evening:
- Dinner:
- Entertainment/nightlife:

Repeat the same structure for every day.
"""

    response = bedrock_runtime.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ],
            }
        ],
        inferenceConfig={
            "maxTokens": 3000,
            "temperature": 0.7,
        },
    )

    return response["output"]["message"]["content"][0]["text"]