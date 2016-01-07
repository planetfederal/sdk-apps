import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import ole from 'ole';
import {addLocaleData, IntlProvider} from 'react-intl';
import App from './node_modules/boundless-sdk/js/components/App.js';
import FeatureTable from './node_modules/boundless-sdk/js/components/FeatureTable.jsx';
import enLocaleData from './node_modules/react-intl/dist/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';

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

var serviceUrl = 'http://services.arcgis.com/rOo16HdIMeOBI4Mb/ArcGIS/rest/services/Drive%20from%20Salt%20and%20Straw_Points%20(5%2010%2015%20Minutes)/FeatureServer/';
var layer = '0';
var esrijsonFormat = new ol.format.EsriJSON();
var vectorSource;

window.fsCallback = function(jsonData) {
  vectorSource.addFeatures(esrijsonFormat.readFeatures(jsonData));
};
var vectorSource = new ol.source.Vector({
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
  title: 'Drive time',
  source: vectorSource
});

var map;

window.styleCb = function(response) {
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
  layers: [raster, vector],
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

class EsriApp extends App {
  render() {
    return (
      <article>
        <div ref='map' id='map'>
        </div>
        <div ref='tablePanel' id='table-panel' className='attributes-table'>
          <FeatureTable ref='table' resizeTo='table-panel' offset={[30, 30]} layer={vector} map={map} />
        </div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><EsriApp map={map} /></IntlProvider>, document.getElementById('main'));
