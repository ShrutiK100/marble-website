import pandas
import geopandas
from pandas_geojson import read_geojson
from pandas_geojson import to_geojson
from pandas_geojson import write_geojson
import datetime as dt
import xarray as xr

import netCDF4



path_geojson = "../temp/datasets/ne_110m_admin_0_countries.geojson"
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

#NOTE: df_geojson is a GeoDataFrame object
df_geojson = geopandas.read_file(path_geojson)


# print(df_geojson.head())
# print(df_geojson.columns)
# print(df_geojson.ISO_A2)

path_csv = "../temp/datasets/GlobalLandTemperaturesByCountry.csv"
# Columns: Index(['dt', 'AverageTemperature', 'AverageTemperatureUncertainty', 'Country'], dtype='object')
# df_csv = pandas.read_csv(path_csv)
# print(df_csv.columns)
# print(df_csv.head())

# df_csv.sort_values(by='dt', ascending=True, inplace=True)
# print(df_csv.head())

# df_temp2013= df_csv[df_csv['dt'].str.contains('2013')]
# print(df_temp2013.head())

# df_temp2013_grouped_country = df_temp2013.groupby('Country')
# print(df_temp2013_grouped_country.head())
# df.loc[df['column_name'] == some_value]
# print(df_temp2013_grouped_country['Afghanistan'])

# df_temp2013_AVG = df_temp2013_grouped_country.mean()
# print(df_temp2013_AVG.head())
# df_merged = pandas.merge(df_geojson, df_temp2013, left_on='NAME', right_on='Country')

# print(df_merged.head())



path_csv_countries_lat_long = "../temp/datasets/average-latitude-longitude-countries.csv"
path_csv_countries_cities = "../temp/datasets/city_temperature.csv"


df_csv_countries_lat_long = pandas.read_csv(path_csv_countries_lat_long)
# Columns: Index(['ISO 3166 Country Code', 'Country', 'Latitude', 'Longitude'], dtype='object')
# print(df_csv_countries_lat_long.columns)


df_csv_countries_cities = pandas.read_csv(path_csv_countries_cities)
# Columns: Index(['Region', 'Country', 'State', 'City', 'Month', 'Day', 'Year',
#        'AvgTemperature'],
#       dtype='object')
# print(df_csv_countries_cities.columns)

### Clean Data

# Clean df_csv_countries_cities
df_csv_countries_cities = df_csv_countries_cities.replace('US', 'United States of America')
df_csv_countries_cities = df_csv_countries_cities.replace('Russia', 'Russian Federation')
df_csv_countries_cities = df_csv_countries_cities.replace('North Korea', "Democratic People's Republic of Korea")
df_csv_countries_cities = df_csv_countries_cities.replace('South Korea', "Republic of Korea")


# Clean df_csv_countries_lat_long
df_csv_countries_lat_long = df_csv_countries_lat_long.replace('United States', 'United States of America')


### End Clean Data

df_csv_countries_cities.sort_values(by='Year', ascending=False, inplace=True)
# print(df_csv_countries_cities.head())
# temp_celsius = (temp_fahr - 32) * 5 / 9

df_temp2020 = df_csv_countries_cities[df_csv_countries_cities['Year'] == 2020]
# print(df_temp2020.head())

df_temp2020["AvgTempCelcius"] = (df_temp2020["AvgTemperature"] - 32) * 5 / 9


# df_temp2020_celcius =

df_temp2020_grouped_country_AVG = df_temp2020.groupby('Country').mean()
df_temp2020_grouped_country_AVG['AvgTempCelcius'] = df_temp2020_grouped_country_AVG['AvgTempCelcius'].round(1)
# print(df_temp2020_grouped_country_AVG.head())

df_merged_temp2020_lat_long = pandas.merge(df_temp2020_grouped_country_AVG, df_csv_countries_lat_long, left_on='Country', right_on='Country')


banner_geojson = pandas.merge(df_geojson, df_merged_temp2020_lat_long, left_on='ISO_A2', right_on='ISO 3166 Country Code')
# df_merged = df_geojson.merge(df_merged_temp2020_lat_long, left_on='NAME', right_on='Country')
# print(banner_geojson.head())

df_merged_cols = banner_geojson.columns
# print(df_merged_cols)

#geo_json = to_geojson(df=df_merged, lat='Latitude', lon='Longitude', properties=df_merged_cols)

# banner_geojson = banner_geojson.to_json(na='null', show_bbox = True)

banner_geojson.to_file('../temp/datasets/banner.geojson', driver='GeoJSON')

# result = banner_geojson.dtypes
# print(result)






path_csv_countries = "../temp/datasets/countries.csv"
# Columns:  Country  Importance  Altitude   Latitude  Longitude
# df_csv_countries = pandas.read_csv(path_csv_countries)
# print(df_csv_countries.head())
# print(df_csv_countries.columns)

# path_netcdf = "../temp/datasets/Complete_TAVG_Daily_LatLong1_2020.nc"

# path_netcdf = "../temp/datasets/Land_and_Ocean_LatLong1.nc"
# Columns: Index(['land_mask', 'temperature', 'climatology'], dtype='object')
# ds = xr.open_dataset(path_netcdf)
# df_netcdf = ds.to_dataframe()

# print(df_netcdf.columns)
# print(df_netcdf.head)

# land_mask = df_netcdf.land_mask
# print(land_mask.head())

# column0 = land_mask.latitude
# print(column0.head())
# df.loc[df['column_name'] == some_value]
# row = df_netcdf.loc[df_netcdf.land_mask[0].str.contains("33.77")]
# print(row)




# nc = netCDF4.Dataset(path_netcdf)
# h = nc.variables

# print(h)
