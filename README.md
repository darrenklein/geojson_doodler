# geojson_doodler
GeoJSON Doodler allows users to draw their own GeoJSONs, add properties and values, and then export them all as a batch.  Geometries that have been given the same layer_name attribute will be bundled into FeatureCollections, allowing users to create multi-object layers as well as individual geometries.

This app relies on the Leaflet and Leaflet.draw APIs.  Big thanks to https://bl.ocks.org/kalebdf/ee7a5e7f44416b2116c0 for laying down the basics of the .csv export!