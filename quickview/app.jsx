import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import ToolActions from 'boundless-sdk/js/actions/ToolActions.js';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
import FeatureTable from 'boundless-sdk/js/components/FeatureTable.jsx';
import Measure from 'boundless-sdk/js/components/Measure.jsx';
import LoadingPanel from 'boundless-sdk/js/components/LoadingPanel.jsx';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import MapConfig from 'boundless-sdk/js/components/MapConfig.jsx';
import Select from 'boundless-sdk/js/components/Select.jsx';
import WFST from 'boundless-sdk/js/components/WFST.jsx';
import Geolocation from 'boundless-sdk/js/components/Geolocation.jsx';
import Zoom from 'boundless-sdk/js/components/Zoom.jsx';
import Rotate from 'boundless-sdk/js/components/Rotate.jsx';
import HomeButton from 'boundless-sdk/js/components/HomeButton.jsx';
import InfoPopup from 'boundless-sdk/js/components/InfoPopup.jsx';
import Globe from 'boundless-sdk/js/components/Globe.jsx';
import Legend from 'boundless-sdk/js/components/Legend.jsx';
import Login from 'boundless-sdk/js/components/Login.jsx';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import Navigation from 'boundless-sdk/js/components/Navigation.jsx';
import enLocaleData from 'react-intl/locale-data/en.js';
import enMessages from 'boundless-sdk/locale/en.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

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
      title: 'Base Maps',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: 'OSM Streets',
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          type: 'base',
          title: 'CartoDB light',
          visible: false,
          source: new ol.source.XYZ({
            url: 'http://s.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            attributions: [
              new ol.Attribution({
                html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              })
            ]
          })
        }),
        new ol.layer.Tile({
          type: 'base',
          title: 'CartoDB dark',
          visible: false,
          source: new ol.source.XYZ({
            url: 'http://s.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            attributions: [
              new ol.Attribution({
                html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              })
            ]
          })
        }),
        new ol.layer.Tile({
          type: 'base',
          title: 'ESRI world imagery',
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
    })
  ],
  controls: [new ol.control.Attribution({collapsible: false}), new ol.control.ScaleLine()],
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

const messages = defineMessages({
  legendtab: {
    id: 'quickview.legendtab',
    description: 'Title of the legend tab',
    defaultMessage: 'Legend'
  },
  attributestab: {
    id: 'quickview.attributestab',
    description: 'Title of the attributes table tab',
    defaultMessage: 'Table'
  },
  layerstab: {
    id: 'quickview.layerstab',
    description: 'Title of the layers tab',
    defaultMessage: 'Layers'
  },
  wfsttab: {
    id: 'quickview.wfsttab',
    description: 'Title of the wfst tab',
    defaultMessage: 'Edit'
  }
});

var locale = 'en';
var i18n = enMessages;

class QuickView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    };
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
            <Select toggleGroup='navigation' map={map}/>
            <Navigation secondary={true} toggleGroup='navigation' toolId='nav' />
            <MapConfig map={map}/>
          </Toolbar>
          <div className="row container">
            <div className="col tabs" id="tabspanel">
              <Tabs value={this.state.value} onChange={this.handleChange.bind(this)} disableTouchRipple={true}>
                <Tab value={1} label={formatMessage(messages.layerstab)} disableTouchRipple={true}><div id='layerlist'><LayerList allowStyling={false} expandOnHover={false} showOnStart={true} addLayer={{allowUserInput: true, url: '/geoserver/wms'}} allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div></Tab>
                <Tab value={2} label={formatMessage(messages.legendtab)} disableTouchRipple={true}><div id='legend'><Legend map={map} /></div></Tab>
                <Tab value={3} label={formatMessage(messages.attributestab)} disableTouchRipple={true}><div id="attributes-table-tab"><FeatureTable resizeTo='tabspanel' offset={[0, 48]} map={map} /></div></Tab>
                <Tab value={4} label={formatMessage(messages.wfsttab)} disableTouchRipple={true}><div id='wfst'><WFST toggleGroup='navigation' showEditForm={true} map={map} /></div></Tab>
              </Tabs>
            </div>
            <div className="col maps">
              <MapPanel id='map' map={map} />
              <LoadingPanel map={map} />
              <div id='globe-button'><Globe map={map} /></div>
              <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' toolId='nav' infoFormat='application/vnd.ogc.gml' map={map} /></div>
              <div id='geolocation-control'><Geolocation map={map} /></div>
              <div id='home-button'><HomeButton map={map} /></div>
              <div id='zoom-buttons'><Zoom map={map} /></div>
              <div id='rotate-button'><Rotate map={map} /></div>
            </div>
          </div>
        </div>
    );
  }
}

QuickView.propTypes = {
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};


QuickView = injectIntl(QuickView);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><QuickView /></IntlProvider>, document.getElementById('main'));
