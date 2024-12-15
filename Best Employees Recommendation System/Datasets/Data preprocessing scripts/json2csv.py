import pandas as pd
import json
import csv  # Required for quoting options

# Initialize a list to store the parsed JSON objects
data = []

# Open and read the NDJSON file line by line
with open("yelp_academic_dataset_business.json", "r", encoding='utf-8') as file:
    for line in file:
        data.append(json.loads(line))  # Parse each JSON object and add to the list

# Flatten the list of dictionaries into a DataFrame
df = pd.json_normalize(data)

# Save the DataFrame to a CSV file with quoting for specific columns
df.to_csv(
    "yelp_academic_dataset_business.csv",
    index=False,
    na_rep="NULL",
    quoting=csv.QUOTE_NONNUMERIC  # Quote only non-numeric values
)

print("File converted successfully")
