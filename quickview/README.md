# Quickview Application

[http://boundlessgeo.github.io/sdk-apps/quickview](http://boundlessgeo.github.io/sdk-apps/quickview)

Quickview application is the main sample application from Boundless SDK.

This sample includes a header with menu buttons, a left drawer with tabs, and several widgets on the map panel.

Menu buttons:

  * MapConfig to export and load map configuration from local storage
  * draw feature to add to the appropriate layer
  * login/logout for GeoServer access
  * select features by rectangle
  * measure distance or area on the map
  * navigation to toggle between this action and other header controls

Left drawer options:

  * Layer list and the option to add layers
  * Legend that can show legend graphic (for WMS layers only)
  * Table to display a feature table for a given layer

On map buttons:

  * Zoom in/out
  * Geolocation
  * Home button to zoom to initial extent
  * Globe button to toggle 3D view
  * Rotate button that shows the rotation of the map and resets on click

Quickview implements a loading panel component to show a spinner when map tiles and images are loading.

A scaleline in the lower right corner displays rough distances for scale reference.

Quickview includes four basemaps: OSM Streets, ESRI world imagery, CartoDB dark, and CartoDB light.
All layers can be made visible and not visible.
The vector layers have additional functions to zoom to, show opacity, download, filter, and drag and drop.
