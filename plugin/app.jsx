import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import DrawBox from './components/DrawBox';
import BoxInfo from './components/BoxInfo';
import Header from '@boundlessgeo/sdk/components/Header';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import InfoPopup from '@boundlessgeo/sdk/components/InfoPopup';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import enMessages from '@boundlessgeo/sdk/locale/en';

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
                html: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  render() {
    return (
       <div id='content'>
        <div className='row container'>
          <Header showLeftIcon={false} title='Boundless SDK'>
            <Navigation map={map} />
            <DrawBox strokeColor='#00FF00' map={map} toggleGroup='navigation' />
          </Header>
          <MapPanel id='map' map={map}/>
          <div id='layer-list'><LayerList map={map} /></div>
          <div id='zoom-buttons'><Zoom map={map} /></div>
          <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' map={map} /></div>
        </div>
        <div className='row boxinfo'>
          <BoxInfo />
        </div>
      </div>
    );
  }
}

MyApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp /></IntlProvider>, document.getElementById('main'));
