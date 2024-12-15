import pandas as pd
#import csv  # Required for quoting options

# Read the CSV file
input_file = "ratings.csv"  # Replace with your input CSV file path
output_file = "ratings_with_splitted_bCategories.csv"  # Replace with your desired output file path

# Load the CSV into a DataFrame
df = pd.read_csv(input_file)

# Create a new DataFrame by splitting the 'categories' column
split_rows = df['categories'].str.split(', ', expand=True).stack().reset_index(level=1, drop=True)
split_rows.name = 'category'

# Merge the split categories with the original DataFrame
result_df = df.drop(columns=['categories']).join(split_rows)

# Reorder columns to have 'category' at the beginning
result_df = result_df[['category'] + [col for col in result_df.columns if col != 'category']]

# Save the transformed DataFrame to a new CSV file
result_df.to_csv(output_file,
                 index=False,
                 na_rep="NULL")#,
                 #quoting=csv.QUOTE_NONNUMERIC) # Quote only non-numeric values)

print(f"Categories splitted successfully")
