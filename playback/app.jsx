import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from 'boundless-sdk/components/MapPanel';
import LayerList from 'boundless-sdk/components/LayerList';
import Zoom from 'boundless-sdk/components/Zoom';
import Playback from 'boundless-sdk/components/Playback';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from 'boundless-sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  enLocaleData
);

var styleFires = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.030000,
    anchorOrigin: 'top-left',
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    anchor: [0.5, 0.5],
    src: './data/styles/amenity=fire_station2321243910.svg',
    rotation: 0.000000
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
    new ol.layer.Vector({
      opacity: 1.0,
      source: new ol.source.Vector({
        url: './data/fires.json',
        format: new ol.format.GeoJSON()
      }),
      id: 'lyr00',
      timeInfo: {
        start: 'STARTDATED',
        end: 'OUTDATED'
      },
      style: styleFires,
      title: 'Fires',
      isSelectable: true
    })
  ],
  view: new ol.View({
    center: [-13733338.84659537, 5983866.321199833],
    zoom: 7
  })
});

class PlaybackApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  render() {
    return (
      <div id='content'>
        <MapPanel id='map' map={map}>
          <div id='timeline'><Playback map={map} minDate={324511200000} maxDate={1385938800000} /></div>
        </MapPanel>
        <div id='zoom-buttons'><Zoom map={map} /></div>
        <div id='layerlist'><LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
      </div>
    );
  }
}

PlaybackApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><PlaybackApp /></IntlProvider>, document.getElementById('main'));
