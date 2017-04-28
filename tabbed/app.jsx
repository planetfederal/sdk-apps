import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import LeftNav from '@boundlessgeo/sdk/components/LeftNav';
import Geocoding from '@boundlessgeo/sdk/components/Geocoding';
import GeocodingResults from '@boundlessgeo/sdk/components/GeocodingResults';
import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import Measure from '@boundlessgeo/sdk/components/Measure';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import Select from '@boundlessgeo/sdk/components/Select';
import QueryBuilder from '@boundlessgeo/sdk/components/QueryBuilder';
import Chart from '@boundlessgeo/sdk/components/Chart';
import Geolocation from '@boundlessgeo/sdk/components/Geolocation';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import QGISLegend from '@boundlessgeo/sdk/components/QGISLegend';
import ImageExport from '@boundlessgeo/sdk/components/ImageExport';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import QGISPrint from '@boundlessgeo/sdk/components/QGISPrint';
import Header from '@boundlessgeo/sdk/components/Header';
import Login from '@boundlessgeo/sdk/components/Login';
import {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import nlLocaleData from 'react-intl/locale-data/nl';
import enLocaleData from 'react-intl/locale-data/en';
import nlMessages from './nl';
import enMessages from '@boundlessgeo/sdk/locale/en';
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
  }
});

nlMessages['app.geocodingtab'] = 'Adres';
nlMessages['app.attributestab'] = 'Attribuuttabel';
nlMessages['app.querytab'] = 'Bevragen';
nlMessages['app.charttab'] = 'Grafieken';
nlMessages['app.chart1'] = 'Aantal vliegvelden per gebruikscategorie';
nlMessages['app.chart2'] = 'Totaal oppervlakte bos';

enMessages['app.geocodingtab'] = 'Find place';
enMessages['app.attributestab'] = 'Table';
enMessages['app.querytab'] = 'Query';
enMessages['app.charttab'] = 'Charts';
enMessages['app.chart1'] = 'Number of airports per usage category';
enMessages['app.chart2'] = 'Total area of forest';

var locale = window.location.search.indexOf('nl') !== -1 ? 'nl' : 'en';
var i18n = locale === 'nl' ? nlMessages : enMessages;

class TabbedApp extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      value: 1,
      leftNavOpen: true
    };
  }
  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }
  handleChange(value) {
    if (value === parseInt(value, 10)) {
      this.setState({
        value: value
      });
    }
  }
  layerListOpen(value) {
    this.setState({
      addLayerOpen: true
    });
  }
  layerListClose(value) {
    this.setState({
      addLayerOpen: false
    });
  }
  leftNavOpen(value) {
    this.setState({
      leftNavOpen: true
    }, function() {
      map.updateSize();
    });
  }
  leftNavClose(value) {
    this.setState({
      leftNavOpen: false
    }, function() {
      map.updateSize();
    });
  }
  render() {
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
    var tabList = [
      <Tab key={1} value={1} label='LayerList' onActive={this.layerListOpen.bind(this)}>
        <div id='layer-list'>
          <LayerList
            inlineDialogs={true}
            icon={<FlatButton label="ADD"/>}
            addLayer={{
              open:this.state.addLayerOpen,
              onRequestClose:this.layerListClose.bind(this),
              allowUserInput: true,
              sources: [{url: '/geoserver/wms', type: 'WMS', title: 'Local GeoServer'}]}}
              allowFiltering={true}
              showOpacity={true}
              showDownload={true}
              showGroupContent={true}
              showZoomTo={true}
              allowReordering={true}
              map={map} />
          </div>
        </Tab>,
      <Tab key={2} value={2} label={formatMessage(messages.geocodingtab)}><div style={{background: CustomTheme.palette.canvasColor}} id='geocoding-tab'><Geocoding /></div><div id='geocoding-results' className='geocoding-results'><GeocodingResults map={map} /></div></Tab>,
      <Tab key={3} value={3} label={formatMessage(messages.attributestab)}><div id="attributes-table-tab" style={{height: '100%'}}><FeatureTable ref='table' map={map} /></div></Tab>,
      <Tab key={4} value={4} label={formatMessage(messages.querytab)}><div id='query-panel' className='query-panel'><QueryBuilder map={map} /></div></Tab>,
      <Tab key={5} value={5} label={formatMessage(messages.charttab)}><div id='charts-tab'><Chart combo={true} charts={charts}/></div></Tab>
    ];
    return (
      <div id='content' style={{background: CustomTheme.palette.canvasColor}}>
        <Header title='Boundless SDK TabbedApp' onLeftIconTouchTap={this.leftNavOpen.bind(this)}>
          <Login />
          <ImageExport map={map} />
          <Measure toggleGroup='navigation' map={map}/>
          <QGISPrint map={map} layouts={printLayouts} />
          <Select toggleGroup='navigation' map={map}/>
          <Navigation secondary={true} toggleGroup='navigation' map={map}/>
        </Header>
        <LeftNav tabList={tabList} open={this.state.leftNavOpen} onRequestClose={this.leftNavClose.bind(this)}/>
        <div className='map' style={{left: this.state.leftNavOpen ? 360 : 0, width: this.state.leftNavOpen ? 'calc(100% - 360px)' : '100%'}}>
          <MapPanel id='map' map={map} />
          <LoadingPanel map={map} />
          <div id='legend'><QGISLegend map={map} legendBasePath='./resources/legend/' legendData={legendData} /></div>
          <div id='geolocation-control'><Geolocation map={map} /></div>
          <div id='home-button'><HomeButton map={map} /></div>
          <div id='zoom-buttons'><Zoom map={map} /></div>
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

TabbedApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

TabbedApp = injectIntl(TabbedApp);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><TabbedApp /></IntlProvider>, document.getElementById('main'));
