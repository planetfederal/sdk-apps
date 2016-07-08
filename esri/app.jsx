import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import ole from 'ole';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import FeatureTable from 'boundless-sdk/js/components/FeatureTable.jsx';
import Zoom from 'boundless-sdk/js/components/Zoom.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en.js';
import enMessages from 'boundless-sdk/locale/en.js';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  enLocaleData
);

var attribution = new ol.Attribution({
  html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
});
var raster = new ol.layer.Tile({
  type: 'base',
  title: 'World Topo',
  source: new ol.source.XYZ({
    attributions: [attribution],
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
      'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  })
});

var serviceUrl = 'https://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Drive%20from%20Salt%20and%20Straw_Points%20(5%2010%2015%20Minutes)/FeatureServer/';
var layer = '0';
var esrijsonFormat = new ol.format.EsriJSON();
var vectorSource;

window.fsCallback = function(jsonData) {
  vectorSource.addFeatures(esrijsonFormat.readFeatures(jsonData));
};
vectorSource = new ol.source.Vector({
  format: esrijsonFormat,
  loader: function(extent, resolution, projection) {
    var script = document.createElement('script');
    script.src = serviceUrl + layer + '/query/?f=json&' +
        'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
        encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
          extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
          ',"spatialReference":{"wkid":102100}}') +
          '&callback=fsCallback&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
          '&outSR=102100';
    document.head.appendChild(script);
  },
  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
    tileSize: 512
  }))
});
var vector = new ol.layer.Vector({
  id: 'drv_time',
  title: 'Drive time',
  source: vectorSource
});

var map;

window.styleCb = function(response) {
  if (response.error) {
    return;
  }
  var srs = response.extent.spatialReference.wkid;
  var extent = [response.extent.xmin, response.extent.ymin, response.extent.xmax, response.extent.ymax];
  if (srs === 4267) {
    extent = ol.proj.get('EPSG:3857').getExtent();
  }
  map.getView().fit(extent, map.getSize());
  ole.VectorLayerModifier.modifyLayer(response, vector, map.getView().getProjection());
};

var styleUrl = serviceUrl + layer + '?f=json';
var script = document.createElement('script');
script.src = styleUrl + '&callback=styleCb';
document.head.appendChild(script);

map = new ol.Map({
  controls: [new ol.control.Attribution({collapsible: false})],
  layers: [raster, vector],
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

class EsriApp extends React.Component {
  render() {
    return (
      <div id='content'>
        <MapPanel id='map' className='row' map={map} />
        <div id='zoom-buttons'><Zoom map={map} /></div>
        <div ref='tablePanel' id='table-panel' className='row attributes-table'>
          <FeatureTable ref='table' resizeTo='table-panel' offset={[0, 0]} layer={vector} map={map} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><EsriApp /></IntlProvider>, document.getElementById('main'));
