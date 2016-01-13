import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import App from './node_modules/boundless-sdk/js/components/App.js';
import LayerList from './node_modules/boundless-sdk/js/components/LayerList.jsx';
import Geocoding from './node_modules/boundless-sdk/js/components/Geocoding.jsx';
import GeocodingResults from './node_modules/boundless-sdk/js/components/GeocodingResults.jsx';
import Select from './node_modules/boundless-sdk/js/components/Select.jsx';
import QueryBuilder from './node_modules/boundless-sdk/js/components/QueryBuilder.jsx';
import FeatureTable from './node_modules/boundless-sdk/js/components/FeatureTable.jsx';
import Chart from './node_modules/boundless-sdk/js/components/Chart.jsx';
import UI from 'pui-react-buttons';
import Icon from 'pui-react-iconography';
import BUTTON from 'pui-react-buttons';
import Edit from './node_modules/boundless-sdk/js/components/Edit.jsx';
import Globe from './node_modules/boundless-sdk/js/components/Globe.jsx';
import InfoPopup from './node_modules/boundless-sdk/js/components/InfoPopup.jsx';
import ToolActions from './node_modules/boundless-sdk/js/actions/ToolActions.js';
import enLocaleData from './node_modules/react-intl/dist/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';

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
    src: '../../data/styles/amenity=fire_station2321243910.svg',
    rotation: 0.000000
  })
});

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
      popupInfo: '<b>cat</b>: [cat]<br><b>NA3</b>: [NA3]<br><b>ELEV</b>: [ELEV]<br><b>F_CODE</b>: [F_CODE]<br><b>IKO</b>: [IKO]<br><b>NAME</b>: [NAME]<br><b>USE</b>: [USE]',
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

var charts = [{
  title: 'Airports count per use category',
  categoryField: 'USE',
  layer: 'lyr03',
  valueFields: [],
  displayMode: 2,
  operation: 2
}, {
  title: 'Forest area total surface',
  categoryField: 'VEGDESC',
  layer: 'lyr01',
  valueFields: ['AREA_KM2'],
  displayMode: 1,
  operation: 2
}];

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

var selectedLayer = map.getLayers().item(2);

class BasicApp extends App {
  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  _toggleTable() {
    this._toggle(ReactDOM.findDOMNode(this.refs.tablePanel));
    this.refs.table.getWrappedInstance().setDimensionsOnState();
  }
  _toggleQuery() {
    this._toggle(ReactDOM.findDOMNode(this.refs.queryPanel));
  }
  _toggleEdit() {
    this._toggle(ReactDOM.findDOMNode(this.refs.editToolPanel));
  }
  _navigationFunc() {
    ToolActions.activateTool(null, 'navigation');
  }
  render() {
    return (
      <article>
        <nav role='navigation'>
          <div className='toolbar'>
            <div id='geocoding' className='pull-right'><Geocoding /></div>
            <ul className='pull-right' id='toolbar-table'><UI.DefaultButton onClick={this._toggleTable.bind(this)} title="Attributes table"><Icon.Icon name="list-alt" /> Table</UI.DefaultButton></ul>
            <ul className='pull-right' id='toolbar-query'><UI.DefaultButton onClick={this._toggleQuery.bind(this)}><Icon.Icon name="filter" /> Query</UI.DefaultButton></ul>
            <ul className='pull-right' id='toolbar-chart'><Chart container='chart-panel' charts={charts} /></ul>
            <ul className='pull-right' id='toolbar-edit'><UI.DefaultButton onClick={this._toggleEdit.bind(this)}><Icon.Icon name="pencil" /> Edit</UI.DefaultButton></ul>
            <ul className='pull-right' id='toolbar-select'><Select toggleGroup='navigation' map={map}/></ul>
            <ul className='pull-right' id='toolbar-navigation'><BUTTON.DefaultButton onClick={this._navigationFunc.bind(this)}> <Icon.Icon name="hand-paper-o" /> Navigation</BUTTON.DefaultButton></ul>
          </div>
        </nav>
        <div id='content'>
          <div ref='map' id='map'>
            <div ref='queryPanel' className='query-panel'><QueryBuilder map={map} /></div>
            <div id='geocoding-results' className='geocoding-results'><GeocodingResults map={map} /></div>
            <div ref='editToolPanel' className='edit-tool-panel'><Edit toggleGroup='navigation' map={map} /></div>
            <div id='globe-button' className='ol-unselectable ol-control'><Globe map={map} /></div>
          </div>
          <div id='chart-panel' className='chart-panel'>
            <div id='chart'></div>
          </div>
          <div ref='tablePanel' id='table-panel' className='attributes-table'><FeatureTable ref='table' resizeTo='table-panel' offset={[30, 30]} layer={selectedLayer} map={map} /></div>
          <div id='layerlist'><LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
          <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' map={map} /></div>
        </div>
      </article>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><BasicApp map={map} /></IntlProvider>, document.getElementById('main'));
