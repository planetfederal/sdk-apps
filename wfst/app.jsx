import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import Header from '@boundlessgeo/sdk/components/Header';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import EditPopup from '@boundlessgeo/sdk/components/EditPopup';
import DrawFeature from '@boundlessgeo/sdk/components/DrawFeature';
import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


addLocaleData(
  enLocaleData
);

var vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: function(extent, resolution, projection) {
    return '/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=topp:states&' +
        'outputFormat=application/json&srsname=EPSG:3857&' +
        'bbox=' + extent.join(',') + ',EPSG:3857';
  },
  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
    maxZoom: 19
  }))
});


var vector = new ol.layer.Vector({
  source: vectorSource,
  id: 'wfst',
  wfsInfo: {
    featureNS: 'http://www.openplans.org/topp',
    attributes: ['STATE_NAME', 'STATE_FIPS', 'SUB_REGION', 'STATE_ABBR', 'LAND_KM', 'WATER_KM', 'PERSONS', 'FAMILIES', 'HOUSEHOLD', 'MALE', 'FEMALE', 'WORKERS', 'DRVALONE', 'CARPOOL'],
    featureType: 'states',
    featurePrefix: 'topp',
    geometryType: 'MultiPolygon',
    geometryName: 'the_geom',
    url: '/geoserver/wfs'
  },
  isWFST: true,
  title: 'WFST layer',
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2
    })
  })
});

var map = new ol.Map({
  controls: [new ol.control.Attribution({collapsible: false})],
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'Streets',
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          type: 'base',
          title: 'Aerial',
          visible: false,
          source: new ol.source.XYZ({
            attributions: [
              new ol.Attribution({
                html: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              })
            ],
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          })
        })
      ]
    }),
    vector
  ],
  view: new ol.View({
    center: [-10331840.239250705, 5782308.315717014],
    zoom: 4
  })
});

const style = new ol.style.Style({fill: new ol.style.Fill({color: 'orange'}), stroke: new ol.style.Stroke({color: 'black', width: 1})});
class WFSTApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  render() {
    return (
      <div id='content'>
        <Header showLeftIcon={false} title='Boundless SDK WFS-T Application'>
          <Navigation toggleGroup='nav' secondary={true} />
          <DrawFeature toggleGroup='nav' map={map} />
        </Header>
        <MapPanel id='map' map={map} />
        <div id='editpopup' className='ol-popup'><EditPopup toggleGroup='nav' map={map} /></div>
        <div id='zoom-buttons'><Zoom map={map} /></div>
        <div id='table'><FeatureTable modifyStyle={style} layer={vector} toggleGroup='nav' map={map} /></div>
      </div>
    );
  }
}

WFSTApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><WFSTApp /></IntlProvider>, document.getElementById('main'));
