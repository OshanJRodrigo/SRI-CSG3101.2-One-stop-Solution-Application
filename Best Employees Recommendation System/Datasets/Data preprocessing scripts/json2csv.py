import pandas as pd
import json

# Initialize a list to store the parsed JSON objects
data = []

# Open and read the NDJSON file line by line
with open("yelp_academic_dataset_business.json", "r", encoding='utf-8') as file:
    for line in file:
        data.append(json.loads(line))  # Parse each JSON object and add to the list

# Flatten the list of dictionaries into a DataFrame [flattening is done because of having nested items (e.g.: in "attributes" key)]
df = pd.json_normalize(data)

# Converting JSON data to a pandas DataFrame
#df = pd.read_json(data)

# Save the DataFrame to a CSV file
df.to_csv("yelp_academic_dataset_business.csv", index=False, na_rep="NULL")

print("File converted successfully")
