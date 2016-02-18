import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import App from './node_modules/boundless-sdk/js/components/app.js';
import HomeButton from './node_modules/boundless-sdk/js/components/HomeButton.jsx';
import LayerList from './node_modules/boundless-sdk/js/components/LayerList.jsx';
import Toolbar from './node_modules/boundless-sdk/js/components/Toolbar.jsx';
import Measure from './node_modules/boundless-sdk/js/components/Measure.jsx';
import enLocaleData from './node_modules/react-intl/dist/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';

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
          title: 'OpenStreetMap',
          visible: false,
          source: new ol.source.OSM()
        }),
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
    var options = [{
      jsx: (<Measure pullRight={true} map={map} />)
    }, {
      exclude: true,
      pullRight: false,
      jsx: (<article><img src="logo.svg" width="30" height="30"></img><span className='app-title'>Map Layers</span></article>)
    }];
    return (
      <article>
        <Toolbar options={options} />
        <div ref='map' id='map'></div>
        <div><LayerList showZoomTo={true} allowReordering={true} addLayer={{url: 'http://localhost:8080/geoserver/wms?'}} expandOnHover={false} map={map} /></div>
        <div id='home-button' className='ol-unselectable ol-control'><HomeButton map={map} /></div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp useHistory={false} map={map} /></IntlProvider>, document.getElementById('main'));
