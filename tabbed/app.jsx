import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import ToolActions from 'boundless-sdk/js/actions/ToolActions.js';
import Zoom from 'boundless-sdk/js/components/Zoom.jsx';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
import Geocoding from 'boundless-sdk/js/components/Geocoding.jsx';
import GeocodingResults from 'boundless-sdk/js/components/GeocodingResults.jsx';
import FeatureTable from 'boundless-sdk/js/components/FeatureTable.jsx';
import Measure from 'boundless-sdk/js/components/Measure.jsx';
import LoadingPanel from 'boundless-sdk/js/components/LoadingPanel.jsx';
import Select from 'boundless-sdk/js/components/Select.jsx';
import QueryBuilder from 'boundless-sdk/js/components/QueryBuilder.jsx';
import Chart from 'boundless-sdk/js/components/Chart.jsx';
import Geolocation from 'boundless-sdk/js/components/Geolocation.jsx';
import QGISLegend from 'boundless-sdk/js/components/QGISLegend.jsx';
import ImageExport from 'boundless-sdk/js/components/ImageExport.jsx';
import HomeButton from 'boundless-sdk/js/components/HomeButton.jsx';
import AddLayer from 'boundless-sdk/js/components/AddLayer.jsx';
import QGISPrint from 'boundless-sdk/js/components/QGISPrint.jsx';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import RaisedButton from 'material-ui/lib/raised-button';
import Login from 'boundless-sdk/js/components/Login.jsx';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import PanIcon from 'material-ui/lib/svg-icons/action/pan-tool';
import nlLocaleData from 'react-intl/locale-data/nl.js';
import enLocaleData from 'react-intl/locale-data/en.js';
import nlMessages from 'boundless-sdk/locale/nl.js';
import enMessages from 'boundless-sdk/locale/en.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo: 
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  nlLocaleData
);

addLocaleData(
  enLocaleData
);

var styleTrees = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(186,221,105,0.505882)'
  })
});

var textStyleCacheAirports = {};
var styleAirports = function() {
  var value = '';
  var style = [new ol.style.Style({
    image: new ol.style.Icon({
      scale: 0.025000,
      anchorOrigin: 'top-left',
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      anchor: [0.5, 0.5],
      src: './data/styles/plane.svg'
    })
  })];
  var labelText = '';
  var key = value + '_' + labelText;
  if (!textStyleCacheAirports[key]) {
    var text = new ol.style.Text({
      font: '16.5px Calibri,sans-serif',
      text: labelText,
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 0, 255)'
      })
    });
    textStyleCacheAirports[key] = new ol.style.Style({
      'text': text
    });
  }
  var allStyles = [textStyleCacheAirports[key]];
  allStyles.push.apply(allStyles, style);
  return allStyles;
};

var textStyleCachePopp = {};
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
  }
  var value = '';
  style = [new ol.style.Style({
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
  var labelText = '';
  var key = value + '_' + labelText;
  if (!textStyleCachePopp[key]) {
    var text = new ol.style.Text({
      font: '16.5px Calibri,sans-serif',
      text: labelText,
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 0, 255)'
      })
    });
    textStyleCachePopp[key] = new ol.style.Style({
      'text': text
    });
  }
  var allStyles = [textStyleCachePopp[key]];
  allStyles.push.apply(allStyles, style);
  return allStyles;
};

var map = new ol.Map({
  controls: [],
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
      id: 'lyr03',
      isSelectable: true,
      title: 'airports',
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

var selectedLayer = map.getLayers().item(2);
var legendData = {
  'lyr03': [{
    title: '',
    href: '6_0.png'
  }],
  'lyr02': [{
    title: '',
    href: '5_0.png'
  }],
  'lyr01': [{
    title: '',
    href: '0_0.png'
  }]
};

var printLayouts = [{
  name: 'Layout 1',
  thumbnail: 'layout1_thumbnail.png',
  width: 420.0,
  elements: [{
    name: 'Title',
    height: 40.825440467359044,
    width: 51.98353115727002,
    y: 39.25222551928783,
    x: 221.77507418397624,
    font: 'Helvetica',
    type: 'label',
    id: '24160ce7-34a3-4f25-a077-8910e4889681',
    size: 18
  }, {
    height: 167.0,
    width: 171.0,
    grid: {
      intervalX: 0.0,
      intervalY: 0.0,
      annotationEnabled: false,
      crs: ''
    },
    y: 19.0,
    x: 16.0,
    type: 'map',
    id: '3d532cb9-0eca-4e50-9f0a-ce29b1c7f5a6'
  }],
  height: 297.0
}, {
  name: 'Layout 2',
  thumbnail: 'layout2_thumbnail.png',
  width: 297.0,
  elements: [{
    name: 'Title',
    height: 11.7757,
    width: 185.957,
    y: 1.96261,
    x: 52.9905,
    font: 'Helvetica',
    type: 'label',
    id: 'f636a119-4d1b-43de-995c-cc11f8fd7b61',
    size: 20
  }, {
    height: 61.2703125,
    width: 30.0296875,
    y: 142.289,
    x: 11.285,
    type: 'legend',
    id: 'ce0dc16b-f7cc-4385-8a05-b9b0bcc4e94f'
  }, {
    height: 185.0,
    width: 278.0,
    grid: {
      intervalX: 0.0,
      intervalY: 0.0,
      annotationEnabled: false,
      crs: ''
    },
    y: 14.0,
    x: 9.0,
    type: 'map',
    id: 'b968ec26-91a6-44ed-bf59-42d10898f198'
  }],
  height: 210.0
}];

const messages = defineMessages({
  geocodingtab: {
    id: 'app.geocodingtab',
    description: 'Title of the geocoding tab',
    defaultMessage: 'Geocoding'
  },
  attributestab: {
    id: 'app.attributestab',
    description: 'Title of the attributes table tab',
    defaultMessage: 'Attributes table'
  },
  querytab: {
    id: 'app.querytab',
    description: 'Title of the query tab',
    defaultMessage: 'Query'
  },
  charttab: {
    id: 'app.charttab',
    description: 'Title of the chart tab',
    defaultMessage: 'Charts'
  },
  chart1: {
    id: 'app.chart1',
    description: 'Title of the first chart',
    defaultMessage: 'Airports count per use category'
  },
  chart2: {
    id: 'app.chart2',
    description: 'Title of the second chart',
    defaultMessage: 'Forest area total surface'
  },
  navigationbutton: {
    id: 'app.navigationbutton',
    description: 'Text of the Navigation button',
    defaultMessage: 'Navigation'
  },
  navigationbuttontitle: {
    id: 'app.navigationbuttontitle',
    description: 'Title of the Navigation button',
    defaultMessage: 'Switch to map navigation (pan and zoom)'
  }
});

nlMessages['app.geocodingtab'] = 'Adres';
nlMessages['app.attributestab'] = 'Attribuuttabel';
nlMessages['app.querytab'] = 'Bevragen';
nlMessages['app.charttab'] = 'Grafieken';
nlMessages['app.chart1'] = 'Aantal vliegvelden per gebruikscategorie';
nlMessages['app.chart2'] = 'Totaal oppervlakte bos';
nlMessages['app.navigationbutton'] = 'Navigatie';
nlMessages['app.navigationbuttontitle'] = 'Schakel naar kaart navigatie (verschuif en zoom)';

enMessages['app.geocodingtab'] = 'Find place';
enMessages['app.attributestab'] = 'Feature table';
enMessages['app.querytab'] = 'Query';
enMessages['app.charttab'] = 'Charts';
enMessages['app.chart1'] = 'Number of airports per usage category';
enMessages['app.chart2'] = 'Total area of forest';
enMessages['app.navigationbutton'] = 'Navigation';
enMessages['app.navigationbuttontitle'] = 'Go to map navigation (zoom and pan)';

var locale = window.location.search.indexOf('nl') !== -1 ? 'nl' : 'en';
var i18n = locale === 'nl' ? nlMessages : enMessages;

class TabbedApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2
    };
  }
  _navigationFunc() {
    ToolActions.activateTool(null, 'navigation');
  }
  handleChange(value) {
    if (value === parseInt(value, 10)) {
      this.setState({
        value: value,
      });
    }
  }
  render() {
    const buttonStyle = {margin: '10px 12px'};
    const {formatMessage} = this.props.intl;
    var charts = [{
      title: formatMessage(messages.chart1),
      categoryField: 'USE',
      layer: 'lyr03',
      valueFields: [],
      displayMode: 2,
      operation: 2
    }, {
      title: formatMessage(messages.chart2),
      categoryField: 'VEGDESC',
      layer: 'lyr01',
      valueFields: ['AREA_KM2'],
      displayMode: 1,
      operation: 2
    }];
    return (
      <div id='content'>
        <Toolbar>
          <Login />
          <ImageExport map={map} />
          <Measure toggleGroup='navigation' map={map}/>
          <AddLayer map={map} />
          <QGISPrint map={map} layouts={printLayouts} />
          <Select toggleGroup='navigation' map={map}/>
          <RaisedButton style={buttonStyle} icon={<PanIcon />} label={formatMessage(messages.navigationbutton)} onTouchTap={this._navigationFunc.bind(this)} />
        </Toolbar>
        <div className='row container'>
          <div className="col tabs" id="tabs-panel">
            <Tabs value={this.state.value} onChange={this.handleChange.bind(this)}>
              <Tab value={1} label={formatMessage(messages.geocodingtab)}><div id='geocoding-tab'><Geocoding /></div><div id='geocoding-results' className='geocoding-results'><GeocodingResults map={map} /></div></Tab>
              <Tab value={2} label={formatMessage(messages.attributestab)}><div id="attributes-table-tab"><FeatureTable resizeTo='tabs-panel' offset={[50, 60]} layer={selectedLayer} map={map} /></div></Tab>
              <Tab value={3} label={formatMessage(messages.querytab)}><div id='query-panel' className='query-panel'><QueryBuilder map={map} /></div></Tab>
              <Tab value={4} label={formatMessage(messages.charttab)}><div id='charts-tab'><Chart combo={true} charts={charts}/></div></Tab>
            </Tabs>
          </div>
          <div className="col maps">
            <MapPanel id='map' map={map} />
            <LoadingPanel map={map} />
            <div id='layerlist'><LayerList addLayer={{allowUserInput: true, url: '/geoserver/wms'}} allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
            <div id='legend'><QGISLegend map={map} legendBasePath='../../resources/legend/' legendData={legendData} /></div>
            <div id='geolocation-control'><Geolocation map={map} /></div>
            <div id='home-button'><HomeButton map={map} /></div>
            <div id='zoom-buttons'><Zoom map={map} /></div>
          </div>
        </div>
      </div>
    );
  }
}

TabbedApp.propTypes = {
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};


TabbedApp = injectIntl(TabbedApp);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><TabbedApp /></IntlProvider>, document.getElementById('main'));
