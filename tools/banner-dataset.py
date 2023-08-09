import pandas
import geopandas

import xarray as xr

import netCDF4



path = "../temp/datasets/ne_110m_admin_0_countries.geojson"
# Columns: Index(['scalerank', 'featurecla', 'LABELRANK', 'SOVEREIGNT', 'SOV_A3',
#        'ADM0_DIF', 'LEVEL', 'TYPE', 'ADMIN', 'ADM0_A3', 'GEOU_DIF', 'GEOUNIT',
#        'GU_A3', 'SU_DIF', 'SUBUNIT', 'SU_A3', 'BRK_DIFF', 'NAME', 'NAME_LONG',
#        'BRK_A3', 'BRK_NAME', 'BRK_GROUP', 'ABBREV', 'POSTAL', 'FORMAL_EN',
#        'FORMAL_FR', 'NAME_CIAWF', 'NOTE_ADM0', 'NOTE_BRK', 'NAME_SORT',
#        'NAME_ALT', 'MAPCOLOR7', 'MAPCOLOR8', 'MAPCOLOR9', 'MAPCOLOR13',
#        'POP_EST', 'POP_RANK', 'GDP_MD_EST', 'POP_YEAR', 'LASTCENSUS',
#        'GDP_YEAR', 'ECONOMY', 'INCOME_GRP', 'WIKIPEDIA', 'FIPS_10_', 'ISO_A2',
#        'ISO_A3', 'ISO_A3_EH', 'ISO_N3', 'UN_A3', 'WB_A2', 'WB_A3', 'WOE_ID',
#        'WOE_ID_EH', 'WOE_NOTE', 'ADM0_A3_IS', 'ADM0_A3_US', 'ADM0_A3_UN',
#        'ADM0_A3_WB', 'CONTINENT', 'REGION_UN', 'SUBREGION', 'REGION_WB',
#        'NAME_LEN', 'LONG_LEN', 'ABBREV_LEN', 'TINY', 'HOMEPART', 'MIN_ZOOM',
#        'MIN_LABEL', 'MAX_LABEL', 'geometry'],
#       dtype='object')

# df_geojson= geopandas.read_file(path)


# print(df_geojson.head())
# print(df_geojson.columns)
# print(df_geojson.ISO_A2)

path_csv = "../temp/datasets/GlobalLandTemperaturesByCountry.csv"
# Columns: Index(['dt', 'AverageTemperature', 'AverageTemperatureUncertainty', 'Country'], dtype='object')
df_csv = pandas.read_csv(path_csv)
# print(df_csv.columns)
# print(df_csv.head())

contain_values = df_csv[df_csv['dt'].str.contains('1743')]

print(contain_values.head())


path_csv_countries = "../temp/datasets/countries.csv"
# Columns:  Country  Importance  Altitude   Latitude  Longitude
# df_csv_countries = pandas.read_csv(path_csv_countries)
# print(df_csv_countries.head())
# print(df_csv_countries.columns)

# path_netcdf = "../temp/datasets/Complete_TAVG_Daily_LatLong1_2020.nc"

path_netcdf = "../temp/datasets/Land_and_Ocean_LatLong1.nc"
# Columns: Index(['land_mask', 'temperature', 'climatology'], dtype='object')
# ds = xr.open_dataset(path_netcdf)
# df_netcdf = ds.to_dataframe()

# print(df_netcdf.columns)
# print(df_netcdf.head)

# land_mask = df_netcdf.land_mask
# print(land_mask.head)

# df.loc[df['column_name'] == some_value]
# row = df_netcdf.loc[df_netcdf.land_mask[0].str.contains("33.77")]
# print(row)




# nc = netCDF4.Dataset(path_netcdf)
# h = nc.variables

# print(h)
