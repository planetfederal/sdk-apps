import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import FeatureTable from './node_modules/boundless-sdk/js/components/FeatureTable.jsx';
import enLocaleData from './node_modules/react-intl/dist/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';

addLocaleData(
  enLocaleData
);

var styleTrees = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(186,221,105,0.505882)'
  })
});

var styleAirports = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.025000,
    anchorOrigin: 'top-left',
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    anchor: [0.5, 0.5],
    src: '../../data/styles/plane.svg'
  })
});

var baseStylePopp = [new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7.0,
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,255)',
      lineDash: null,
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,255,255,1.0)'
    })
  })
}), new ol.style.Style({
  image: new ol.style.Circle({
    radius: 1.0,
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,255)',
      lineDash: null,
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,1.0)'
    })
  })
})];

var clusterStyleCachePopp = {};
var stylePopp = function(feature) {
  var style;
  var features = feature.get('features');
  var size = 0;
  for (var i = 0, ii = features.length; i < ii; ++i) {
    if (features[i].selected) {
      return null;
    }
    if (features[i].hide !== true) {
      size++;
    }
  }
  if (size === 0) {
    return null;
  }
  if (size !== 1) {
    style = clusterStyleCachePopp[size];
    if (!style) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: '#fff'
          }),
          fill: new ol.style.Fill({
            color: '#3399CC'
          })
        }),
        text: new ol.style.Text({
          text: size.toString(),
          fill: new ol.style.Fill({
            color: '#fff'
          })
        })
      });
      clusterStyleCachePopp[size] = style;
    }
    return style;
  } else {
    return baseStylePopp;
  }
};

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
          title: 'Aerial',
          source: new ol.source.MapQuest({layer: 'sat'})
        }),
        new ol.layer.Tile({
          type: 'base',
          visible: false,
          title: 'None', 
          source: new ol.source.XYZ({
            attributions: [
              new ol.Attribution({
                html: 'Blank tiles: No attribution'
              }),
            ],
          })
        })
      ]
    }),
    new ol.layer.Vector({
      id: 'lyr01',
      isSelectable: true,
      title: 'trees',
      style: styleTrees,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: '../../data/trees.json'
      })
    }),
    new ol.layer.Vector({
      id: 'lyr02',
      isSelectable: true,
      title: 'popp',
      style: stylePopp,
      source: new ol.source.Cluster({
        source: new ol.source.Vector({
          format: new ol.format.GeoJSON(),
          url: '../../data/popp.json'
        })
      })
    }),
    new ol.layer.Vector({
      title: 'airports',
      id: 'lyr03',
      isSelectable: true,
      style: styleAirports,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: '../../data/airports.json'
      })
    })
  ],
  view: new ol.View({
    center: [-16839563.5993915, 8850169.509638],
    zoom: 4
  })
});

var selectedLayer = map.getLayers().item(2);

export default class App extends React.Component {
  componentDidMount() {
    map.setTarget(ReactDOM.findDOMNode(this.refs.map));
  }
  render() {
    return (
      <article>
        <div ref='map' id='map'>
        </div>
        <div ref='tablePanel' id='table-panel' className='attributes-table'><FeatureTable ref='table' resizeTo='table-panel' offset={[30, 30]} layer={selectedLayer} map={map} /></div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><App /></IntlProvider>, document.getElementById('main'));
