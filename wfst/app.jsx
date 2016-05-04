import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import RaisedButton from 'material-ui/lib/raised-button';
import App from 'boundless-sdk/js/components/App.js';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import WFST from 'boundless-sdk/js/components/WFST.jsx';
import enLocaleData from 'react-intl/locale-data/en.js';
import enMessages from 'boundless-sdk/locale/en.js';
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
        'version=1.1.0&request=GetFeature&typename=usa:states&' +
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
    featureNS: 'http://census.gov',
    featureType: 'states',
    featurePrefix: 'usa',
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
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'Streets',
          source: new ol.source.MapQuest({layer: 'osm'})
        }),
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'Aerial',
          source: new ol.source.MapQuest({layer: 'sat'})
        }),
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'None',
          source: new ol.source.XYZ({
            attributions: [
              new ol.Attribution({
                html: 'Blank Titles: No attribution'
              })
            ]
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

class WFSTApp extends App {
  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  _toggleWFST() {
    this._toggle(ReactDOM.findDOMNode(this.refs.wfstPanel));
  }
  render() {
    const buttonStyle = {margin: '10px 12px'};
    return (
      <div id='content'>
        <Toolbar><RaisedButton style={buttonStyle} onTouchTap={this._toggleWFST.bind(this)} label='WFS-T' /></Toolbar>
        <div id='wfst' ref='wfstPanel'><WFST map={map} /></div>
        <div ref='map' id='map'></div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><WFSTApp map={map} /></IntlProvider>, document.getElementById('main'));
