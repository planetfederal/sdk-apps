# Tabbed Application

[http://boundlessgeo.github.io/sdk-apps/tabbed](http://boundlessgeo.github.io/sdk-apps/tabbed)

Tabbed application shows how to use a tabbed application in a Boundless SDK application.

This sample includes a header with menu buttons, a left drawer with tabs, and several widgets on the map panel.

Menu buttons:

  * navigation to toggle between this action and other header controls
  * select features by rectangle
  * QGIS print
  * measure distance or area on the map
  * export an image of the current map panel
  * login/logout for GeoServer access


Left drawer options:

  * Layer list and the option to add layers
  * Search by placename with Geocoding component
  * Query to filter a given layer by feature attributes
  * Charts to display feature data
  * Table to display a feature table for a given layer

On map buttons:

  * Zoom in/out
  * Geolocation
  * Home button to zoom to initial extent

The tabbed application implements a loading panel component to show a spinner when map tiles and images are loading.

The tabbed application includes two basemaps: Aerial and Streets.
And three vector layers: airports, popp, and trees.
All layers can be made visible and not visible.
The vector layers have additional functions to zoom to, show opacity, download, filter, and drag and drop.
