import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Bookmarks from '@boundlessgeo/sdk/components/Bookmarks';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
          title: 'Streets',
          source: new ol.source.OSM()
        })
      ]
    })
  ],
  view: new ol.View({
    center: [260119.36358071605, 6255406.541948485],
    zoom: 11
  })
});

var bookmarks = [{
  name: 'Le Grenier Pain',
  description: '<b>Address: </b>38 rue des Abbesses<br><b>Telephone:</b> 33 (0)1 46 06 41 81<br><a href="http://www.legrenierapain.com">Website</a>',
  extent: [259562.7661267497, 6254560.095662868, 260675.9610346824, 6256252.988234103]
}, {
  name: 'Poilne',
  description: '<b>Address: </b>8 rue du Cherche-Midi<br><b>Telephone:</b> 33 (0)1 45 48 42 59<br><a href="http://www.poilane.fr">Website</a>',
  extent: [258703.71361629796, 6248811.5276565505, 259816.90852423065, 6250503.271278702]
}, {
  name: 'Pain d\'Epis',
  description: '<b>Address: </b>63 ave Bosquet<br><b>Telephone:</b> 33 (0)1 45 51 75 01<br><a href="https://www.yelp.com/biz/pain-d-epis-paris">Website</a>',
  extent: [256033.93826860288, 6249647.883472723, 257147.1331765356, 6251339.794169339]
}, {
  name: 'Le Moulin de la Vierge',
  description: '<b>Address: </b>166 avenue de Suffren<br><b>Telephone:</b> 33 (0)1 47 83 45 55<br><a href="https://www.yelp.fr/biz/le-moulin-de-la-vierge-paris">Website</a>',
  extent: [256411.75662035524, 6248016.017431838, 257524.95152828796, 6249707.602166038]
}, {
  name: 'Maison Kayser',
  description: '<b>Address: </b>14 rue Monge<br><b>Telephone:</b> 33 (0)1 44 07 17 81<br><a href="http://www.maison-kayser.com/">Website</a>',
  extent: [261005.24408844888, 6248428.056353206, 262118.4389963816, 6250119.723381014]
}, {
  name: 'Au 140',
  description: '<b>Address: </b>140 rue de Belleville<br><b>Telephone:</b> 33 (0)1 46 36 92 47<br><a href="http://www.davidlebovitz.com/2006/12/140/">Website</a>',
  extent: [265468.710391296, 6252874.480301509, 266581.90529922873, 6254567.035831345]
}, {
  name: 'Le Notre',
  description: '<b>Address: </b>10 rue Saint Antoine<br><b>Telephone:</b> 33 (0)1 53 01 91 91<br><a href="http://www.lenotre.fr/fr/boulanger.php">Website</a>',
  extent: [262926.7298190316, 6249251.010162451, 264039.9247269643, 6250942.841574115]
}];

class BookmarkApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  render() {
    return (
      <div id='content'>
        <MapPanel id='map' map={map}>
          <div id='bookmarks-panel'><Bookmarks introTitle='Paris bakeries' introDescription='Explore the best bakeries of the capital of France' map={map} bookmarks={bookmarks} /></div>
        </MapPanel>
        <div id='zoom-buttons'><Zoom map={map} /></div>
      </div>
    );
  }
}

BookmarkApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><BookmarkApp /></IntlProvider>, document.getElementById('main'));
