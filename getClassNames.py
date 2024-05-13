import pandas as pd
import glob
# LANDCOVER CLASS
# Assuming all CSV files are in the same directory, read files
monthly_files = glob.glob('/content/data/monthly_summary_*.csv')
igbp_file = '/content/igbp_classification.csv'

# Read the igbp_classification.csv file
igbp_data = pd.read_csv(igbp_file)

# Define a function to add the igbp_nam column
def add_igbp_name_column(input_files):
    for file in input_files:
        # Read the CSV file
        df = pd.read_csv(file)

        # Check if igbp_nam column already exists
        if 'igbp_nam' not in df.columns:
            # Merge with igbp_data based on landcover_class
            merged_df = pd.merge(df, igbp_data[['igbp_value', 'igbp_name']], left_on='landcover_class', right_on='igbp_value', how='left')
            # Drop the duplicate ADM0_CODE column
            merged_df.drop(columns=['igbp_value'], inplace=True)
            # Rename the ADM0_NAME column to adm0_name
            merged_df.rename(columns={'igbp_name': 'igbp_nam'}, inplace=True)
            # Filter out duplicate rows
            merged_df = merged_df.drop_duplicates()
            # Save the updated DataFrame back to the CSV file
            merged_df.to_csv(file, index=False)


# Add igbp_name column to monthly files
add_igbp_name_column(monthly_files)

# ECOREGIONS
# Assuming all CSV files are in the same directory, read files
ecoregions_files = glob.glob('/content/data/ecoregions_monthly*.csv')
eco_file = '/content/ecoregions_Classification2017_RESOLVE.csv'

# Read the igbp_classification.csv file
eco_data = pd.read_csv(eco_file)

# Define a function to add the igbp_nam column
def add_eco_name_column(input_files):
    for file in input_files:
        # Read the CSV file
        df = pd.read_csv(file)

        # Check if igbp_nam column already exists
        if 'eco_name' not in df.columns:
            # Merge with eco_data based on eco_id
            merged_df = pd.merge(df, eco_data[['ECO_ID', 'ECO_NAME']], left_on='eco_id', right_on='ECO_ID', how='left')
            # Drop the duplicate ADM0_CODE column
            merged_df.drop(columns=['ECO_ID'], inplace=True)
            # Rename the ADM0_NAME column to adm0_name
            merged_df.rename(columns={'ECO_NAME': 'eco_name'}, inplace=True)
            # Filter out duplicate rows
            merged_df = merged_df.drop_duplicates()
            # Save the updated DataFrame back to the CSV file
            merged_df.to_csv(file, index=False)


# Add eco_name column to ecoregions files
add_eco_name_column(ecoregions_files)


# BIOMES
# Assuming all CSV files are in the same directory, read files
biomes_files = glob.glob('/content/data/biomes_monthly*.csv')
biome_file = '/content/biomes_classification.csv'

# Read the igbp_classification.csv file
biome_data = pd.read_csv(biome_file)

# Define a function to add the igbp_nam column
def add_biome_name_column(input_files):
    for file in input_files:
        # Read the CSV file
        df = pd.read_csv(file)

        # Check if biome_name column already exists
        if 'biome_name' not in df.columns:
            # Merge with eco_data based on eco_id
            merged_df = pd.merge(df, biome_data[['BIOME_ID', 'BIOME_NAME']], left_on='biome_num', right_on='BIOME_ID', how='left')
            # Drop the duplicate ADM0_CODE column
            merged_df.drop(columns=['BIOME_ID'], inplace=True)
            # Rename the ADM0_NAME column to adm0_name
            merged_df.rename(columns={'BIOME_NAME': 'biome_name'}, inplace=True)
            # Filter out duplicate rows
            merged_df = merged_df.drop_duplicates()
            # Save the updated DataFrame back to the CSV file
            merged_df.to_csv(file, index=False)


# Add eco_name column to ecoregions files
add_biome_name_column(biomes_files)



