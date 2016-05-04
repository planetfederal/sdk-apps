import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import App from 'boundless-sdk/js/components/App.js';
import ToolActions from 'boundless-sdk/js/actions/ToolActions.js';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
import FeatureTable from 'boundless-sdk/js/components/FeatureTable.jsx';
import Measure from 'boundless-sdk/js/components/Measure.jsx';
import LoadingPanel from 'boundless-sdk/js/components/LoadingPanel.jsx';
import MapConfig from 'boundless-sdk/js/components/MapConfig.jsx';
import Select from 'boundless-sdk/js/components/Select.jsx';
import WFST from 'boundless-sdk/js/components/WFST.jsx';
import QueryBuilder from 'boundless-sdk/js/components/QueryBuilder.jsx';
import Geolocation from 'boundless-sdk/js/components/Geolocation.jsx';
import HomeButton from 'boundless-sdk/js/components/HomeButton.jsx';
import InfoPopup from 'boundless-sdk/js/components/InfoPopup.jsx';
import AddLayer from 'boundless-sdk/js/components/AddLayer.jsx';
import Globe from 'boundless-sdk/js/components/Globe.jsx';
import Legend from 'boundless-sdk/js/components/Legend.jsx';
import Login from 'boundless-sdk/js/components/Login.jsx';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import RaisedButton from 'material-ui/lib/raised-button';
import enLocaleData from 'react-intl/locale-data/en.js';
import enMessages from 'boundless-sdk/locale/en.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PanIcon from 'material-ui/lib/svg-icons/action/pan-tool';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

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
    })
  ],
  controls: ol.control.defaults().extend([new ol.control.ScaleLine()]),
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

const messages = defineMessages({
  legendtab: {
    id: 'geoexplorer.legendtab',
    description: 'Title of the legend tab',
    defaultMessage: 'Legend'
  },
  attributestab: {
    id: 'geoexplorer.attributestab',
    description: 'Title of the attributes table tab',
    defaultMessage: 'Table'
  },
  layerstab: {
    id: 'geoexplorer.layerstab',
    description: 'Title of the layers tab',
    defaultMessage: 'Layers'
  },
  querytab: {
    id: 'geoexplorer.querytab',
    description: 'Title of the query tab',
    defaultMessage: 'Query'
  },
  wfsttab: {
    id: 'geoexplorer.wfsttab',
    description: 'Title of the wfst tab',
    defaultMessage: 'Edit'
  },
  navigationbutton: {
    id: 'geoexplorer.navigationbutton',
    description: 'Text of the Navigation button',
    defaultMessage: 'Navigation'
  },
  navigationbuttontitle: {
    id: 'geoexplorer.navigationbuttontitle',
    description: 'Title of the Navigation button',
    defaultMessage: 'Switch to map navigation (pan and zoom)'
  }
});

var locale = 'en';
var i18n = enMessages;

class GeoExplorer extends App {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
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
    const {formatMessage} = this.props.intl;
    return (
        <div id='content'>
          <Toolbar>
            <ToolbarGroup float="right">
              <Login />
            </ToolbarGroup>
            <Measure toggleGroup='navigation' map={map}/>
            <AddLayer map={map} />
            <Select toggleGroup='navigation' map={map}/>
            <RaisedButton style={{margin: '10px 12px'}} icon={<PanIcon />} label={formatMessage(messages.navigationbutton)} onTouchTap={this._navigationFunc.bind(this)} />
            <MapConfig map={map}/>
          </Toolbar>
          <div className="row container">
            <div className="col tabs" id="tabspanel">
              <Tabs value={this.state.value} onChange={this.handleChange.bind(this)}>
                <Tab value={1} label={formatMessage(messages.layerstab)}><div id='layerlist'><LayerList allowStyling={true} expandOnHover={false} showOnStart={true} addLayer={{allowUserInput: true, url: '/geoserver/wms'}} allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div></Tab>
                <Tab value={2} label={formatMessage(messages.legendtab)}><div id='legend'><Legend map={map} /></div></Tab>
                <Tab value={3} label={formatMessage(messages.attributestab)}><div id="attributes-table-tab"><FeatureTable resizeTo='tabspanel' offset={[50, 60]} map={map} /></div></Tab>
                <Tab value={4} label={formatMessage(messages.querytab)}><div id='query-panel' className='query-panel'><QueryBuilder map={map} /></div></Tab>
                <Tab value={5} label={formatMessage(messages.wfsttab)}><div id='wfst'><WFST showEditForm={true} map={map} /></div></Tab>
              </Tabs>
            </div>
            <div className="col maps">
              <div id='map' ref='map'className="col-8-12"></div>
              <LoadingPanel map={map} />
              <div id='globe-button'><Globe map={map} /></div>
              <div id='popup' className='ol-popup'><InfoPopup infoFormat='application/vnd.ogc.gml' toggleGroup='navigation' map={map} /></div>
              <div id='geolocation-control'><Geolocation map={map} /></div>
              <div id='home-button'><HomeButton map={map} /></div>
            </div>
          </div>
        </div>
    );
  }
}

GeoExplorer.propTypes = {
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};


GeoExplorer = injectIntl(GeoExplorer);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><GeoExplorer map={map} /></IntlProvider>, document.getElementById('main'));
