import pandas as pd
import json
import glob

# Function to process ecoregion CSV files
def process_ecoregions(ecoregion_files):
    ecoregions_data = {}
    for file in ecoregion_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            eco_name = row['eco_name']
            eco_burnedarea = row['burned_area(ha)']
            eco_id = row['eco_id']
            if country not in ecoregions_data:
                ecoregions_data[country] = {}
            if year_month not in ecoregions_data[country]:
                ecoregions_data[country][year_month] = {'ecoregion': {}}
            # Sequential numbering for ecoregions within a country and year-month
            entry_number = len(ecoregions_data[country][year_month]['ecoregion']) + 1
            ecoregions_data[country][year_month]['ecoregion'][entry_number] = {
                'eco_name': eco_name,
                'eco_burnedarea': eco_burnedarea,
                'eco_id': eco_id
            }
    return ecoregions_data

# List ecoregion CSV files
ecoregion_files = glob.glob('/content/data/ecoregions_*.csv')

# Process ecoregion CSV files
ecoregions_data = process_ecoregions(ecoregion_files)

# Write combined data to JSON file
with open('ecoregions_combined.json', 'w') as f:
    json.dump(ecoregions_data, f, indent=4)


# Function to process landcover CSV files
def process_landcover(landcover_files):
    landcover_data = {}
    for file in landcover_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            igbp_nam = row['igbp_nam']
            landcover_burnedarea = row['burned_area(ha)']
            lc_id = row['landcover_class']
            if country not in landcover_data:
                landcover_data[country] = {}
            if year_month not in landcover_data[country]:
                landcover_data[country][year_month] = {'landcover': {}}
            # Sequential numbering for landcover within a country and year-month
            entry_number = len(landcover_data[country][year_month]['landcover']) + 1
            landcover_data[country][year_month]['landcover'][entry_number] = {
                'igbp_nam': igbp_nam,
                'landcover_burnedarea': landcover_burnedarea,
                'lc_id': lc_id
            }
    return landcover_data

# List landcover CSV files
landcover_files = glob.glob('/content/data/monthly_*.csv')

# Process landcover CSV files
landcover_data = process_landcover(landcover_files)

# Write combined data to JSON file
with open('landcover_combined.json', 'w') as f:
    json.dump(landcover_data, f, indent=4)


# Function to process biomes CSV files
def process_biomes(biomes_files):
    biomes_data = {}
    for file in biomes_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            biome_name = row['biome_name']
            biome_burnedarea = row['burned_area(ha)']
            biome_id = row['biome_num']
            if country not in biomes_data:
                biomes_data[country] = {}
            if year_month not in biomes_data[country]:
                biomes_data[country][year_month] = {'biome': {}}
            # Sequential numbering for biomes within a country and year-month
            entry_number = len(biomes_data[country][year_month]['biome']) + 1
            biomes_data[country][year_month]['biome'][entry_number] = {
                'biome_name': biome_name,
                'biome_burnedarea': biome_burnedarea,
                'biome_id': biome_id
            }
    return biomes_data

# List biome CSV files
biomes_files = glob.glob('/content/data/biomes_*.csv')

# Process biome CSV files
biomes_data = process_biomes(biomes_files)

# Write combined data to JSON file
with open('biomes_combined.json', 'w') as f:
    json.dump(biomes_data, f, indent=4)

import json

# Load data from ecoregions_combined.json
with open('ecoregions_combined.json', 'r') as f:
    ecoregions_data = json.load(f)

# Load data from biomes_combined.json
with open('biomes_combined.json', 'r') as f:
    biomes_data = json.load(f)

# Load data from landcover_combined.json
with open('landcover_combined.json', 'r') as f:
    landcover_data = json.load(f)

# Combine the data
combined_data = {}

# Iterate over countries in ecoregions data
for country, country_data in ecoregions_data.items():
    if country not in combined_data:
        combined_data[country] = {}
    # Iterate over year-month in ecoregions data
    for year_month, data in country_data.items():
        if year_month not in combined_data[country]:
            combined_data[country][year_month] = {'ecoregion': {}, 'biome': {}, 'landcover': {}}
        # Add ecoregion data
        combined_data[country][year_month]['ecoregion'] = data['ecoregion']
        # Add biome data if available
        if country in biomes_data and year_month in biomes_data[country]:
            combined_data[country][year_month]['biome'] = biomes_data[country][year_month]['biome']
        # Add landcover data if available
        if country in landcover_data and year_month in landcover_data[country]:
            combined_data[country][year_month]['landcover'] = landcover_data[country][year_month]['landcover']

# Write combined data to JSON file
with open('combined_data.json', 'w') as f:
    json.dump(combined_data, f, indent=4)


# Function to process ecoregion CSV files
def process_ecoregions(ecoregion_files):
    ecoregions_data = {}
    for file in ecoregion_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            eco_name = row['eco_name']
            eco_burnedarea = row['burned_area(ha)']
            eco_id = row['eco_id']
            if country not in ecoregions_data:
                ecoregions_data[country] = {}
            if year_month not in ecoregions_data[country]:
                ecoregions_data[country][year_month] = {'ecoregion': {}}
            # Sequential numbering for ecoregions within a country and year-month
            entry_number = len(ecoregions_data[country][year_month]['ecoregion']) + 1
            ecoregions_data[country][year_month]['ecoregion'][entry_number] = {
                'eco_name': eco_name,
                'eco_burnedarea': eco_burnedarea,
                'eco_id': eco_id
            }
    return ecoregions_data

# Function to process biome CSV files
def process_biomes(biome_files):
    biomes_data = {}
    for file in biome_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            biome_name = row['biome_name']
            biome_burnedarea = row['burned_area(ha)']
            biome_num = row['biome_num']
            if country not in biomes_data:
                biomes_data[country] = {}
            if year_month not in biomes_data[country]:
                biomes_data[country][year_month] = {'biome': {}}
            # Sequential numbering for biomes within a country and year-month
            entry_number = len(biomes_data[country][year_month]['biome']) + 1
            biomes_data[country][year_month]['biome'][entry_number] = {
                'biometype': biome_name,
                'biome_burnedarea': biome_burnedarea,
                'biome_num': biome_num
            }
    return biomes_data

# Function to process landcover CSV files
def process_landcover(landcover_files):
    landcover_data = {}
    for file in landcover_files:
        df = pd.read_csv(file)
        for index, row in df.iterrows():
            country = row['adm0_name']
            year_month = row['year-month']
            landcover_type = row['igbp_nam']
            landcover_burnedarea = row['burned_area(ha)']
            lc_id = row['landcover_class']
            if country not in landcover_data:
                landcover_data[country] = {}
            if year_month not in landcover_data[country]:
                landcover_data[country][year_month] = {'landcover': {}}
            # Sequential numbering for landcover within a country and year-month
            entry_number = len(landcover_data[country][year_month]['landcover']) + 1
            landcover_data[country][year_month]['landcover'][entry_number] = {
                'lctype': landcover_type,
                'landcover_burnedarea': landcover_burnedarea,
                'lc_id': lc_id
            }
    return landcover_data

# List files for ecoregions, biomes, and landcover
ecoregion_files = glob.glob('/content/data/ecoregions_*.csv')
biome_files = glob.glob('/content/data/biomes_*.csv')
landcover_files = glob.glob('/content/data/monthly_*.csv')

# Process data from ecoregion CSV files
ecoregions_data = process_ecoregions(ecoregion_files)

# Process data from biome CSV files
biomes_data = process_biomes(biome_files)

# Process data from landcover CSV files
landcover_data = process_landcover(landcover_files)

# Combine all data
combined_data = {}
for country in biomes_data.keys():
    combined_data[country] = {}
    for year_month in biomes_data[country].keys():
        combined_data[country][year_month] = {
            'ecoregion': ecoregions_data.get(country, {}).get(year_month, {}),
            'biome': biomes_data.get(country, {}).get(year_month, {}),
            'landcover': landcover_data.get(country, {}).get(year_month, {})
        }

# Write combined data to JSON file
with open('combined_data.json', 'w') as f:
    json.dump(combined_data, f, indent=4)