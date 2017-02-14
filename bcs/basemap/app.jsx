import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from 'boundless-sdk/components/MapPanel';
import HomeButton from 'boundless-sdk/components/HomeButton';
import Zoom from 'boundless-sdk/components/Zoom';
import LayerList from 'boundless-sdk/components/LayerList';
import AppBar from 'material-ui/AppBar';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from 'boundless-sdk/locale/en';
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
var apikey = "";

var layerArray =[];

function getPromise(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        console.log("resolving..");
        resolve(JSON.parse(req.response));
      }
      else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };
    req.send();
  });
};

var map = new ol.Map({
  controls: [new ol.control.Attribution({collapsible: false})],
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: 'Base maps',
      layers: layerArray
    })
  ],
  view: new ol.View({
    center: [-10764594.758211, 4523072.3184791],
    zoom: 3
  })
});
var messages = {};
function layerLoadComplete()
{
  ReactDOM.render(<IntlProvider locale='en' messages={messages}><MyApp /></IntlProvider>, document.getElementById('main'));
}

getPromise('http://api.dev.boundlessgeo.io/v1/basemaps/').then(function(layerJSON){

  for (var i = 0, len = layerJSON.length; i < len; i++)
  {
    var bm = layerJSON[i];
    if(bm.tileFormat == 'PNG' && bm.standard == 'XYZ')	{
      var	tile = new ol.layer.Tile({
                visible: eval(i == 2),
                title: bm.name,
                type: 'base',
                source: new ol.source.XYZ({url: bm.endpoint+"?apikey="+apikey,  attributions: [
  new ol.Attribution({
  html: bm.attribution
  })]
                })
                });
              }
  layerArray.push(tile);
  }
  map = new ol.Map({
        loadTilesWhileAnimating: true,
        controls: [new ol.control.Attribution({collapsible: true})],
        layers: [
        new ol.layer.Group({
          type: 'base-group',
          title: 'Base maps',
          layers: layerArray,
          view: new ol.View({
          center: [0, 0],
          zoom: 2,
          minZoom: 1,
          maxZoom: 10
          })
        })],
        view: new ol.View({
            center: ol.proj.transform([0.0,0.0], 'EPSG:4326', 'EPSG:3857'),
            zoom: 2
          })
        });

        layerLoadComplete();

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
        <AppBar iconElementLeft={<img style={{marginTop: '10px'}} src="resources/logo.svg" width="30" height="30" />} title="BCS Basemaps" />
        <MapPanel id='map' map={map} useHistory={false}>
        </MapPanel>
        <div><LayerList showOnStart={true} showZoomTo={true} allowReordering={true} expandOnHover={false} map={map} /></div>
        <div id='home-button'><HomeButton map={map} /></div>
        <div id='zoom-buttons'><Zoom map={map} /></div>
      </div>
    );
  }
}

MyApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var messages = {};
function layerLoadComplete()
{
  ReactDOM.render(<IntlProvider locale='en' messages={messages}><MyApp /></IntlProvider>, document.getElementById('main'));
}
