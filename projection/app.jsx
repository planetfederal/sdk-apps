import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {IntlProvider} from 'react-intl';
import proj4 from 'proj4';
import InfoPopup from '@boundlessgeo/sdk/components/InfoPopup';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Header from '@boundlessgeo/sdk/components/Header';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ol.proj.setProj4(proj4);

proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs');

var projection = new ol.proj.Projection({
  code: 'EPSG:28992',
  extent: [-285401.92,22598.08,595401.9199999999,903401.9199999999]
});

var lyr_cbsprovincies212 = new ol.layer.Tile({
  name: 'cbsprovincies2012',
  opacity: 1.0,
  timeInfo: null,
  source: new ol.source.TileWMS({
    url: 'http://geodata.nationaalgeoregister.nl/cbsprovincies/wms?',
    params: {
      'LAYERS': 'cbsprovincies2012',
      'TILED': 'true',
      'STYLES': ''
    }
  }),
  title: 'cbsprovincies2012',
  id: 'cbsprovincies201220160108113901332',
  popupInfo: ''
});

var layersList = [lyr_cbsprovincies212];
var view = new ol.View({
  projection: projection
});

var originalExtent = [-143023.252373, 222652.455129, 429769.110349, 706343.783649];

var map = new ol.Map({
  layers: layersList,
  view: view,
  controls: [new ol.control.MousePosition({'projection': 'EPSG:4326', 'undefinedHTML': '&nbsp;', 'coordinateFormat': ol.coordinate.createStringXY(4)})]
});

class ProjectionApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  componentDidMount() {
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
      <div id='content'>
        <Header showLeftIcon={false} title="Custom Projection"></Header>
        <MapPanel id='map' map={map} extent={originalExtent}>
          <div id='popup' className='ol-popup'><InfoPopup map={map} hover={false}/></div>
        </MapPanel>
        <div id='zoom-buttons'><Zoom map={map} /></div>
      </div>
    );
  }
}

ProjectionApp.propTypes = {
  map: React.PropTypes.instanceOf(ol.Map).isRequired
};

ProjectionApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en'><ProjectionApp map={map} /></IntlProvider>, document.getElementById('main'));
