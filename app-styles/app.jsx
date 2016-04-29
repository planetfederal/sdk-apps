import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import App from './node_modules/boundless-sdk/js/components/App.js';
import HomeButton from './node_modules/boundless-sdk/js/components/HomeButton.jsx';
import LayerList from './node_modules/boundless-sdk/js/components/LayerList.jsx';
import AppBar from 'material-ui/lib/app-bar';
import enLocaleData from './node_modules/react-intl/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  enLocaleData
);

var map = new ol.Map({
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'MapQuest Street Map',
          source: new ol.source.MapQuest({layer: 'osm'})
        }),
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'None'
        })
      ]
    })
  ],
  view: new ol.View({
    center: [-10764594.758211, 4523072.3184791],
    zoom: 3
  })
});

class MyApp extends App {
  render() {
    return (
      <div id='content'>
        <AppBar iconElementLeft={<img style={{marginTop: '10px'}} src="resources/logo.svg" width="30" height="30" />} title="Styling" />
        <div ref='map' id='map'></div>
        <div><LayerList showOnStart={true} showZoomTo={true} allowStyling={true} allowReordering={true} addLayer={{url: '/geoserver/wfs?', asVector: true}} expandOnHover={false} map={map} /></div>
        <div id='home-button'><HomeButton map={map} /></div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp useHistory={false} map={map} /></IntlProvider>, document.getElementById('main'));
