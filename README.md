# lidar-data-inventory
Web maps for searching LiDAR data on the WisconsinView Data Portal.

Search counties here: https://wistcart.github.io/lidar-data-inventory/

Tile search uses ```layer``` parameter in the url to pass which acquistion to view. For example ```https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=dane```.

## Acquisitions

acquistion | layer
--- | ---
Adams 2010 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=adams" target="_blank">```adams```</a>
Ashland 2014 FEMA Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=ashland" target="_blank">```ashland```</a>
Bayfield 2016 FEMA Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=bayfield" target="_blank">```bayfield```</a>
Buffalo 2016 3DEP Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=buffalo" target="_blank">```buffalo```</a>
Burnett 2015 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=burnett" target="_blank">```burnett```</a>
Calumet 2005 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=calumet" target="_blank">```calumet```</a>
Columbia 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=columbia" target="_blank">```columbia```</a>
Crawford 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=crawford" target="_blank">```crawford```</a>
Dane 2017 3DEP Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=dane" target="_blank">```dane```</a>
Madison 2016 City Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=madison" target="_blank">```madison```</a>
Douglas 2016 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=douglas" target="_blank">```douglas```</a>
Florence 2015 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=florence" target="_blank">```florence```</a>
Forest 2017 3DEP Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=forest" target="_blank">```forest```</a>
Grant 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=grant" target="_blank">```grant```</a>
Green 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=green" target="_blank">```green```</a>
Iowa 2010 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=iowa" target="_blank">```iowa```</a>
Iron 2015 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=iron" target="_blank">```iron```</a>
Jefferson 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=jefferson" target="_blank">```jefferson```</a>
Juneau 2010 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=juneau" target="_blank">```juneau```</a>
Kewaunee 2012 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=kewaunee" target="_blank">```kewaunee```</a>
La Crosse 2017 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=lacrosse" target="_blank">```lacrosse```</a>
Lafayette 2011 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=lafayette" target="_blank">```lafayette```</a>
Langlade 2017 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=langlade" target="_blank">```langlade```</a>
Lincoln 2015 County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=lincoln" target="_blank">```lincoln```</a>
Pierce County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=pierce" target="_blank">```pierce```</a>
Washington County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=washington" target="_blank">```washington```</a>
Eau Claire County Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=eauClaire" target="_blank">```eauClaire```</a>
City of Eau Claire Delivery | <a href="https://wistcart.github.io/lidar-data-inventory/tile-search/?layer=cityOfEauClaire" target="_blank">```cityOfEauClaire```</a>

## Pull Requests

If you would like to add a delivery to the repository:

1. Save a GeoJSON in WGS84 with a single field named `tileName`. This _tileName_ will go between the _baseURL_ and _URLexts_ when generating links.
2. Add layer to `README.md`.
3. Add layer to `LidarData.csv` under the `Tile_index` field.
4. Add layer to metadata to `/tile-search/assets/metadata.js`. The [Metadata Tool](https://wistcart.github.io/lidar-data-inventory/tile-search/metadata/) will make the process of writing the metadata easier.