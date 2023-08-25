import pandas
import geopandas

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

path_csv_countries_lat_long = "../temp/datasets/average-latitude-longitude-countries.csv"
path_csv_countries_cities = "../temp/datasets/city_temperature.csv"

df_csv_countries_lat_long = pandas.read_csv(path_csv_countries_lat_long, keep_default_na=False)
# Columns: Index(['ISO 3166 Country Code', 'Country', 'Latitude', 'Longitude'], dtype='object')

# NOTE: Does not include:
# Sudan
# Libya
# Iran
# Niger
# Mali
# Botswana
# Zimbabwe
# Angola
df_csv_countries_cities = pandas.read_csv(path_csv_countries_cities)
# Columns: Index(['Region', 'Country', 'State', 'City', 'Month', 'Day', 'Year',
#        'AvgTemperature'],
#       dtype='object')

### Clean Data

# Remove trailing and leading whitespaces
df_csv_countries_cities['Country'] = df_csv_countries_cities['Country'].str.strip()
df_csv_countries_lat_long['Country'] = df_csv_countries_lat_long['Country'].str.strip()
df_csv_countries_lat_long['ISO 3166 Country Code'] = df_csv_countries_lat_long['ISO 3166 Country Code'].str.strip()

# Clean df_csv_countries_cities
df_csv_countries_cities['Country'] = df_csv_countries_cities['Country'].replace('US', 'United States of America')
df_csv_countries_cities['Country'] = df_csv_countries_cities['Country'].replace('Russia', 'Russian Federation')
df_csv_countries_cities['Country'] = df_csv_countries_cities['Country'].replace('North Korea', "Democratic People's Republic of Korea")
df_csv_countries_cities['Country'] = df_csv_countries_cities['Country'].replace('South Korea', "Republic of Korea")

# Clean df_csv_countries_lat_long
df_csv_countries_lat_long['Country'] = df_csv_countries_lat_long['Country'].replace('United States', 'United States of America')

df_MissingCountry = (df_csv_countries_cities[df_csv_countries_cities['Country'].isin(["Angola"])])
### End Clean Data

# Get only temperatures in 2020
df_temp2020 = df_csv_countries_cities[df_csv_countries_cities['Year'] == 2020]

# Convert to Celcius
df_temp2020["AvgTempCelcius"] = (df_temp2020["AvgTemperature"] - 32) * 5 / 9

# Get average temperature of country
df_temp2020_grouped_country_AVG = df_temp2020.groupby('Country', as_index=False).mean()

# Round temperatures to one decimal place
df_temp2020_grouped_country_AVG['AvgTempCelcius'] = df_temp2020_grouped_country_AVG['AvgTempCelcius'].round(1)

# Merge dataframes to get Country Code in dataset
df_merged_temp2020_lat_long = pandas.merge(df_temp2020_grouped_country_AVG, df_csv_countries_lat_long, left_on='Country'
                                           , right_on='Country')

# Merge dataframes into final dataset
banner_geojson = pandas.merge(df_geojson, df_merged_temp2020_lat_long, how='left', left_on='ISO_A2', right_on='ISO 3166 Country Code')

# Save as geojson file
banner_geojson.to_file('../temp/datasets/banner.geojson', driver='GeoJSON')
