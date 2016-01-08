import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {IntlProvider} from 'react-intl';
import UI from 'pui-react-buttons';
import Icon from 'pui-react-iconography';
import proj4 from 'proj4';
import InfoPopup from './node_modules/boundless-sdk/js/components/InfoPopup.jsx';
import App from './node_modules/boundless-sdk/js/components/App.js';

// TODO can be removed with new ol3 release
global.proj4 = proj4;

proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs');

var projection = new ol.proj.Projection({
  code: 'EPSG:28992',
  extent: [-285401.92,22598.08,595401.9199999999,903401.9199999999]
});

var overlayLayers = [];
var overlaysGroup = new ol.layer.Group({
    showContent: true,
    'title': 'Overlays',
    layers: overlayLayers
});
var lyr_cbsprovincies212 = new ol.layer.Tile({
  opacity: 1.0,
  timeInfo: null,
  source: new ol.source.TileWMS({
    url: "http://geodata.nationaalgeoregister.nl/cbsprovincies/wms?",
    params: {
      "LAYERS": "cbsprovincies2012",
      "TILED": "true",
      "STYLES": ""
    }
  }),
  title: "cbsprovincies2012",
  id: "cbsprovincies201220160108113901332",
  popupInfo: ""
});

var layersList = [lyr_cbsprovincies212];
var view = new ol.View({
  projection: projection
});

var originalExtent = [-143023.252373, 222652.455129, 429769.110349, 706343.783649];

var map = new ol.Map({
  layers: layersList,
  view: view,
  renderer: 'dom',
  controls: [new ol.control.MousePosition({"projection": "EPSG:4326", "undefinedHTML": "&nbsp;", "coordinateFormat": ol.coordinate.createStringXY(4)})]
});

class ProjectionApp extends App {
  componentDidMount() {
    super.componentDidMount();
    this.props.map.addControl(new ol.control.OverviewMap({
      collapsed: true,
      view: new ol.View({
        projection: projection
      }),
      layers: [lyr_cbsprovincies212]
    }));
  }
  render() {
    return (
      <article>
        <nav role='navigation'>
          <div className='toolbar'>
            <a className="navbar-brand" href="#">My Web App</a>
          </div>
        </nav>
        <div id='content'>
          <div id='map' ref='map'>
            <div id='popup' className='ol-popup'><InfoPopup map={map} hover={false}/></div>
          </div>
        </div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en'><ProjectionApp map={map} extent={originalExtent} /></IntlProvider>, document.getElementById('main'));
