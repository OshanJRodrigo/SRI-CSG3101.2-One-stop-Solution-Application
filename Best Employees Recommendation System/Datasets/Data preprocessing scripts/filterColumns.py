import pandas as pd
import csv  # Required for quoting options

# Read the CSV file
input_file = "yelp_academic_dataset_business.csv"  # Replace with your input CSV file path
#output_file = "ratings.csv"  # Replace with your desired output file path
output_file = "business.csv"  # Replace with your desired output file path

# Load the CSV into a DataFrame
df = pd.read_csv(input_file, low_memory=False) # handle columns with mixed types without defaulting to a slower, memory-intensive processing method.

# Retain only the specified columns
#required_columns = ['categories', 'business_id', 'stars']  # 'categories' moved to the beginning
required_columns = ['business_id', 'name', 'latitude','longitude', 'stars', 'review_count', 'is_open']
df_filtered = df[required_columns]

# Save the filtered DataFrame to a CSV file
df_filtered.to_csv(output_file,
                   index=False,
                   na_rep="NULL",
                   quoting=csv.QUOTE_NONNUMERIC) # Quote only non-numeric values

print("File filtered successfully")
