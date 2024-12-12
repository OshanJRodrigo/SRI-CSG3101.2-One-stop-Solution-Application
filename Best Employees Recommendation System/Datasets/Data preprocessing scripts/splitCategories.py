import pandas as pd

# Read the CSV file
input_file = "yelp_academic_dataset_businessCat_busid_overallstars.csv"  # Replace with your input CSV file path
output_file = "yelp_academic_dataset_businessCatSplit_busid_overallstars.csv"  # Replace with your desired output file path

# Load the CSV into a DataFrame
df = pd.read_csv(input_file)

# Create a new DataFrame by splitting the 'category' column
split_rows = df['categories'].str.split(', ', expand=True).stack().reset_index(level=1, drop=True)
split_rows.name = 'category'

# Merge the split categories with the original DataFrame
result_df = df.drop(columns=['categories']).join(split_rows)

# Save the transformed DataFrame to a new CSV file
result_df.to_csv(output_file, index=False)

print(f"Transformed data saved to {output_file}")
