#Tutorial: Quickview

##Introduction
This tutorial takes you through the steps to create a BoundlessSDK application.

## The end game // What you'll build
[Link](http://boundlessgeo.github.io/sdk-apps/quickview)

## Getting Started
Follow getting started instructions to create a new app called myapp.

[Link](https://boundlessgeo.github.io/sdk/book/getting_started.html)

This creates a skeleton app and runs a debug server on port 3000.

## What's in the BoundlessSDK skeleton app `myapp`?
* Two base map layers
  * OSM Streets
  * ESRI World Images
* Two widgets/components
  * Zoom In/Out Buttons
  * `LayerList` Component

##Inside of `myapp/app.jsx`
`app.jsx` is the main file for this BoundlessSDK app.
* initial import statements
  ```
  import React from 'react';
  import ReactDOM from 'react-dom';
  import ol from 'openlayers';
  import {addLocaleData, IntlProvider} from 'react-intl';
  import getMuiTheme from 'material-ui/styles/getMuiTheme';
  import Zoom from 'boundless-sdk/components/Zoom';
  import MapPanel from 'boundless-sdk/components/MapPanel';
  import LayerList from 'boundless-sdk/components/LayerList';
  import injectTapEventPlugin from 'react-tap-event-plugin';
  import enLocaleData from 'react-intl/locale-data/en';
  import enMessages from 'boundless-sdk/locale/en';
  ```
* `ol.Map` definition
  * The Map gets defined with a layer group, that combines the OSM streets and ESRI world imagery layers.
  * The view is defined with an initial center and zoom level
    * To change center with lat/long coordinates, use:
        `center: ol.proj.fromLonLat([long, lat])`
  ```
  var map = new ol.Map({
    controls: [new ol.control.Attribution({collapsible: false})],
    layers: [
      new ol.layer.Group({
        type: 'base-group',
        title: 'Base maps',
        layers: [
          new ol.layer.Tile({
            type: 'base',
            title: 'OSM Streets',
            source: new ol.source.OSM()
          }),
          new ol.layer.Tile({
            type: 'base',
            title: 'ESRI world imagery',
            visible: false,
            source: new ol.source.XYZ({
              attributions: [
                new ol.Attribution({
                  html:['Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community']
                })
              ],
              url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
          })
        ]
      })
    ],
    view: new ol.View({
      center: [0, 0],
      zoom: 4
    })
  });
  ```

##Adding base maps to `myapp` BoundlessSDK app
The skeleton app provides two base maps, OSM Streets and ESRI World Imagery. We’ll add two more to `myapp`: Carto DB Light and Carto DB Dark

Add the following layer definitions in `app.jsx` after the existing OSM Streets layer:

```
new ol.layer.Tile({
  type: 'base',
  title: 'CartoDB light',
  visible: false,
  source: new ol.source.XYZ({
    url: 'http://s.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attributions: [
      new ol.Attribution({
        html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      })
    ]
  })
}),
new ol.layer.Tile({
  type: 'base',
  title: 'CartoDB dark',
  visible: false,
  source: new ol.source.XYZ({
    url: 'http://s.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attributions: [
      new ol.Attribution({
        html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      })
    ]
  })
}),
```

Reload the debug server to see the new base map options we've just added.

##Adding widgets (components) on `myapp` BoundlessSDK app
The first widget/component we'll add is called `GeoLocation`.

What it does: [Link](https://boundlessgeo.github.io/sdk/book/api/Geolocation.html)
  * Geolocation uses the current position of the user in the map. Can show the current position on the map, and also track the position.
    `<Geolocation map={map} />`

* In `app.jsx`

  * import the component
    * import the `Geolocation` component by adding an import statement to the top of `app.jsx`, after the existing import statements

    `import Geolocation from 'boundless-sdk/components/Geolocation'`

  * update the render function
    * In the render function of `myapp`, we need to add the definition of our new component, `Geolocation`, after the existing `Zoom` component

    `<div id='geolocation-control'><Geolocation map={map} /></div>`

* In `app.css`

  * adjust style
    * in `app.css`, we'll adjust the styling to give the new `Geolocation` component a position on the MapPanel

    ```
    #geolocation-control {
      position: absolute;
      margin-left: 20px;
      top: 129px;
    }
    ```

Reload the debug server and see the new widget we've just added.

##Adding a `Toolbar` to `myapp` BoundlessSDK `myapp`
The `Toolbar` will be a landing spot at the top of the app page for menu buttons to be added later.

* In `app.jsx`

  * import the component
    * `import Toolbar from 'material-ui/Toolbar/Toolbar';`

  * update the render function
    * In our render function, make a new `var toolbar` to house the `Toolbar` component and all children components to be added later

    ```
    render() {
      var toolbar = (
        <Toolbar/>
      );
      return (
         <div id='content'>
           {toolbar}
          <MapPanel id='map' map={map} />
          <div id='layer-list'><LayerList collapsible={false} map={map} /></div>
          <div id='zoom-buttons'><Zoom map={map} /></div>
          <div id='geolocation-control'><Geolocation map={map} /></div>
        </div>
      );
    }
    ```

* In `app.css`

  * adjust style

    ```
    #map {
      height: calc(100% - 56px);
    }
    #content {
      width: 100%;
      height: 100%;
      position: fixed;
      bottom: 0px;
    }
    #zoom-buttons {
      margin-left: 20px;
      position: absolute;
      top: 76px;
    }
    #layer-list {
      position: absolute;
      top: 76px;
      right: 20px;
    }
    #geolocation-control {
      position: absolute;
      margin-left: 20px;
      top: 185px;
    }
    ```

Reload the debug server to see the new, empty `Toolbar`.

##Adding a menu button to `myapp` BoundlessSDK app
The first button will add will be a `Measure` component

What it does:
[Link](https://boundlessgeo.github.io/sdk/book/api/Measure.html)
  * `Measure` adds area and length measure tools as a toolbar (menu) button
    `<Measure map={map}/>`

* In `app.jsx`

  * import the component
    * `import Measure from 'boundless-sdk/components/Measure';`

  * update the render function
    * ```
    var toolbar = (
      <Toolbar><Measure map={map}/></Toolbar>
    );
    ```
* No style updates needed for this addition

Reload the debug server and try out the `Measure` button

##Adding a widget from `ol.Map` object in `myapp` BoundlessSDK app
First we'll add a `ScaleLine` directly into our `ol.Map` object

What it does:
[Link](https://openlayers.org/en/latest/apidoc/ol.control.ScaleLine.html)
  * `ScaleLine` is a control displaying rough y-axis distances, calculated for the center of the viewport.
    `ol.control.ScaleLine()`

* In `app.jsx`

  * Update the `ol.Map` controls array to include the `ScaleLine`
    ```
    controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],

    ```

* In `app.css`

  * style the `ScaleLine` to look like the other widgets on the `MapPanel`

    ```
    .ol-scale-line {
      background-color: #0097a7;
    }

    ```

Reload the server too see the new widget
