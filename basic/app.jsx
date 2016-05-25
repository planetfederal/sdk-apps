import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
import Geocoding from 'boundless-sdk/js/components/Geocoding.jsx';
import GeocodingResults from 'boundless-sdk/js/components/GeocodingResults.jsx';
import Select from 'boundless-sdk/js/components/Select.jsx';
import QueryBuilder from 'boundless-sdk/js/components/QueryBuilder.jsx';
import FeatureTable from 'boundless-sdk/js/components/FeatureTable.jsx';
import Chart from 'boundless-sdk/js/components/Chart.jsx';
import MapConfig from 'boundless-sdk/js/components/MapConfig.jsx';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import RaisedButton from 'material-ui/lib/raised-button';
import TableIcon from 'material-ui/lib/svg-icons/action/view-list';
import QueryIcon from 'material-ui/lib/svg-icons/action/query-builder';
import ChartIcon from 'material-ui/lib/svg-icons/editor/insert-chart';
import EditIcon from 'material-ui/lib/svg-icons/editor/mode-edit';
import PanIcon from 'material-ui/lib/svg-icons/action/pan-tool';
import Edit from 'boundless-sdk/js/components/Edit.jsx';
import Globe from 'boundless-sdk/js/components/Globe.jsx';
import InfoPopup from 'boundless-sdk/js/components/InfoPopup.jsx';
import ToolActions from 'boundless-sdk/js/actions/ToolActions.js';
import enLocaleData from 'react-intl/locale-data/en.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enMessages from 'boundless-sdk/locale/en.js';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

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
    src: './data/styles/plane.svg'
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
              })
            ]
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
        url: './data/trees.json'
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
          url: './data/popp.json'
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
        url: './data/airports.json'
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

var selectedLayer = map.getLayers().item(2);

class BasicApp extends React.Component {
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
  _toggleChart() {
    this._toggle(ReactDOM.findDOMNode(this.refs.chartPanel));
  }
  _toggleEdit() {
    this._toggle(ReactDOM.findDOMNode(this.refs.editToolPanel));
  }
  _navigationFunc() {
    ToolActions.activateTool(null, 'navigation');
  }
  render() {
    const buttonStyle = {margin: '10px 12px'};
    return (
      <div id='content'>
        <Toolbar>
          <ToolbarGroup float="right">
            <Geocoding style={{backgroundColor: 'white'}} />
          </ToolbarGroup>
          <MapConfig map={map}/>
          <RaisedButton style={buttonStyle} icon={<TableIcon />} label='Table' onTouchTap={this._toggleTable.bind(this)} />
          <RaisedButton style={buttonStyle} icon={<QueryIcon />} label='Query' onTouchTap={this._toggleQuery.bind(this)} />
          <RaisedButton style={buttonStyle} icon={<ChartIcon />} label='Chart' onTouchTap={this._toggleChart.bind(this)} />
          <RaisedButton style={buttonStyle} icon={<EditIcon />} label='Edit' onTouchTap={this._toggleEdit.bind(this)} />
          <Select toggleGroup='navigation' map={map}/>
          <RaisedButton style={buttonStyle} icon={<PanIcon />} label='Navigation' onTouchTap={this._navigationFunc.bind(this)} />
        </Toolbar>
        <MapPanel id='map' map={map}>
          <div ref='queryPanel' className='query-panel'><QueryBuilder map={map} /></div>
          <div id='geocoding-results' className='geocoding-results'><GeocodingResults map={map} /></div>
          <div ref='editToolPanel' className='edit-tool-panel'><Edit toggleGroup='navigation' map={map} /></div>
          <div id='globe-button'><Globe map={map} /></div>
        </MapPanel>
        <div id='chart-panel' className='chart-panel'>
        </div>
        <div ref='tablePanel' id='table-panel' className='attributes-table'><FeatureTable ref='table' resizeTo='table-panel' offset={[30, 30]} layer={selectedLayer} map={map} /></div>
        <div id='layerlist'><LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
        <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' map={map} /></div>
        <div  id='chart-panel'><Chart ref='chartPanel' combo={true} charts={charts}/></div>
      </div>
    );
  }
}

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><BasicApp /></IntlProvider>, document.getElementById('main'));
