import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import Zoom from 'boundless-sdk/js/components/Zoom.jsx';
import DrawBox from './js/components/DrawBox.jsx';
import BoxInfo from './js/components/BoxInfo.jsx';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
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

class MyApp extends React.Component {
  render() {
    return (
       <div id='content'>
        <div className='row container'>
          <Toolbar>
            <DrawBox style={{margin: '10px 12px'}} strokeColor='#00FF00' map={map} />
          </Toolbar>
          <MapPanel id='map' map={map}>
            <div><LayerList map={map} /></div>
            <div id='zoom-buttons'><Zoom map={map} /></div>
          </MapPanel>
        </div>
        <div className='row boxinfo'>
          <BoxInfo />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp /></IntlProvider>, document.getElementById('main'));
