import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {IntlProvider} from 'react-intl';
import Bookmarks from './node_modules/boundless-sdk/js/components/Bookmarks.jsx';

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
          title: 'None'
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
  name: 'Le Grenier  Pain',
  description: '<br><b>Address: </b>38 rue des Abbesses<br><b>Telephone :</b>33 (0)1 46 06 41 81<br><a href=""http://www.legrenierapain.com"">Website</a>',
  extent: [259562.7661267497, 6254560.095662868, 260675.9610346824, 6256252.988234103]
}, {
  name: 'Poilne',
  description: '<br><b>Address: </b>8 rue du Cherche-Midi<br><b>Telephone :</b>33 (0)1 45 48 42 59<br><a href=""http://www.poilane.fr"">Website</a>',
  extent: [258703.71361629796, 6248811.5276565505, 259816.90852423065, 6250503.271278702]
}, {
  name: 'Pain d\'Epis',
  description: '<br><b>Address: </b>Pain d\'Epis<br><b>Telephone :</b>33 (0)1 45 51 75 01<br><a href=""#"">Website</a>',
  extent: [256033.93826860288, 6249647.883472723, 257147.1331765356, 6251339.794169339]
}, {
  name: 'Le Moulin de la Vierge',
  description: '<br><b>Address: </b>166 avenue de Suffren<br><b>Telephone :</b>33 (0)1 47 83 45 55<br><a href=""#"">Website</a>',
  extent: [256411.75662035524, 6248016.017431838, 257524.95152828796, 6249707.602166038]
}, {
  name: 'Maison Kayser',
  description: '<br><b>Address: </b>14 rue Monge<br><b>Telephone :</b>33 (0)1 44 07 17 81<br><a href=""http://www.maison-kayser.com/"">Website</a>',
  extent: [261005.24408844888, 6248428.056353206, 262118.4389963816, 6250119.723381014]
}, {
  name: 'Au 140',
  description: '<br><b>Address: </b>140 rue de Belleville<br><b>Telephone :</b>33 (0)1 46 36 92 47<br><a href=""http://www.davidlebovitz.com/2006/12/140/"">Website</a>',
  extent: [265468.710391296, 6252874.480301509, 266581.90529922873, 6254567.035831345]
}, {
  name: 'Le Notre',
  description: '<br><b>Address: </b>10 rue Saint Antoine<br><b>Telephone :</b>33 (0)1 53 01 91 91<br><a href=""http://www.lenotre.fr/fr/boulanger.php"">Website</a>',
  extent: [262926.7298190316, 6249251.010162451, 264039.9247269643, 6250942.841574115]
}];

export default class App extends React.Component {
  componentDidMount() {
    map.setTarget(ReactDOM.findDOMNode(this.refs.map));
  }
  render() {
    return (
      <div id='content'>
        <div ref='map' id='map'>
          <div id='bookmarks-panel'><Bookmarks introTitle='Paris bakeries' introDescription='Explore the best bakeries of the capital of France' map={map} bookmarks={bookmarks} /></div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en'><App /></IntlProvider>, document.getElementById('main'));
