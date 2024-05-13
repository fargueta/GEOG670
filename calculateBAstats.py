import numpy as np
import rasterio
from rasterio.windows import Window
from rasterio.io import MemoryFile
from datetime import datetime
from collections import defaultdict  
import os

def process_raster_dataset(input_mcd64a1, input_additional, out_csv, data_type):
    getmeta = rasterio.open(input_mcd64a1)
    metaprofile = getmeta.profile
    hnum = metaprofile['width'] 
    vnum = metaprofile['height'] 
    blocksize = metaprofile['blockxsize'] 

    # Input file handles:
    burndate_data = open(input_mcd64a1, 'rb').read()
    burndate_dataset = MemoryFile(burndate_data).open()

    additional_dataset = rasterio.open(input_additional)

    outvalues = defaultdict(lambda: defaultdict(int))

    for vstart in range(0, vnum, blocksize):
        vblock = vstart // blocksize
        vblocksize = min(blocksize, (blocksize - ((vstart + blocksize) - vnum)))
        for hstart in range(0, hnum, blocksize):
            hblock = hstart // blocksize
            hblocksize = min(blocksize, (blocksize - ((hstart + blocksize) - hnum)))
            targetwindow = Window(hstart, vstart, hblocksize, vblocksize)
            # Read target window into temporary arrays
            burndate_window = burndate_dataset.read(1, window=targetwindow).flatten()
            additional_window = additional_dataset.read(1, window=targetwindow).astype(np.int32).flatten()
            # Stack the arrays
            burndate_bin = burndate_window > 0
            combined_data = additional_window + (burndate_bin * 1000)
            unique_values = np.unique(combined_data)
            for unique_value in unique_values:
                rehydrate_additional = unique_value % 1000
                rehydrate_burndate = unique_value // 1000
                outvalues[rehydrate_burndate][rehydrate_additional] += np.sum(burndate_bin[combined_data == unique_value])

    with open(out_csv, 'w') as oh:
        outlines = ['year-month,adm0_code,{},burned_area(ha)'.format(data_type)]
        for adm0_index in outvalues.keys():
            adm0_values = outvalues[adm0_index]
            if adm0_index > 0:
                for additional_index in adm0_values.keys():
                    ba_value = outvalues[adm0_index][additional_index] * 463.3127 * 463.3127 / 10000 
                    outlines += ['{},{},{},{}'.format(outdate_parsed, adm0_index, additional_index, ba_value)]
        oh.write('\n'.join(outlines)+'\n')

# input files
input_mcd64a1 = sys.argv[1]
year = os.path.basename(input_mcd64a1)[14:18]
jdoy = os.path.basename(input_mcd64a1)[18:21]

input_adm0 = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/G2014_ADM0CODE.tif' # Max value = 14

# Create a string with the current date
current_date = datetime.strftime(datetime.now(), '%Y-%m-%d')
outdate_parsed = datetime.strftime(datetime.strptime(year + jdoy, '%Y%j'), '%Y-%m')

# Process ecoregions dataset
input_eco = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/RESOLVE_ecoregions.tif'
out_eco_csv = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/Ecoregions_Summary_Stats_Country_{}/ecoregions_monthly_summary_country_{}.csv'.format(current_date, outdate_parsed)
process_raster_dataset(input_mcd64a1, input_eco, out_eco_csv, 'eco_id')

# Process biomes dataset
input_biomes = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/RESOLVE_biomes.tif'
out_biomes_csv = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/Biomes_Summary_Stats_Country_{}/biomes_monthly_summary_country_{}.csv'.format(current_date, outdate_parsed)
process_raster_dataset(input_mcd64a1, input_biomes, out_biomes_csv, 'biome_num')

# Process IGBP dataset
input_igbp = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/TIF_Global/MCD12Q1.A{}.Global.061.IGBPClass.tif'.format(year)
if not os.path.exists(input_igbp):
    input_igbp = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/TIF_Global/MCD12Q1.A2021.Global.061.IGBPClass.tif'
out_igbp_csv = '/Volumes/gsdata1/gigliogp/fernanda/fire_dashboard/Summary_Stats_Country_{}/monthly_summary_country_{}.csv'.format(current_date, outdate_parsed)
process_raster_dataset(input_mcd64a1, input_igbp, out_igbp_csv, 'landcover_class')
