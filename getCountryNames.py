import pandas as pd
import glob

# Assuming all CSV files are in the same directory
biomes_files = glob.glob('/content/data/biomes_monthly_*.csv')
monthly_files = glob.glob('/content/data/monthly_summary_*.csv')
ecoregions_files = glob.glob('/content/data/ecoregions_monthly_*.csv')
g2015_file = '/content/adm0_codes.csv'

# Read the adm0_codes.csv file
g2015_data = pd.read_csv(g2015_file)

# Define a function to add the adm0_name column
def add_adm0_name_column(input_files):
    for file in input_files:
        # Read the CSV file
        df = pd.read_csv(file)

        # Check if ADM0_NAME column already exists
        if 'adm0_name' not in df.columns:
            # Merge with g2015_data based on adm0_code
            merged_df = pd.merge(df, g2015_data[['ADM0_CODE', 'ADM0_NAME']], left_on='adm0_code', right_on='ADM0_CODE', how='left')
            # Drop the duplicate ADM0_CODE column
            merged_df.drop(columns=['ADM0_CODE'], inplace=True)
            # Rename the ADM0_NAME column to adm0_name
            merged_df.rename(columns={'ADM0_NAME': 'adm0_name'}, inplace=True)
            # Filter out duplicate rows
            merged_df = merged_df.drop_duplicates()
            # Save the updated DataFrame back to the CSV file
            merged_df.to_csv(file, index=False)

# Add adm0_name column to biomes files
add_adm0_name_column(biomes_files)

# Add adm0_name column to monthly files
add_adm0_name_column(monthly_files)

# Add adm0_name column to ecoregions files
add_adm0_name_column(ecoregions_files)

