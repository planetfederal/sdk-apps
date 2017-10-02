import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import Measure from '@boundlessgeo/sdk/components/Measure';
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import MapConfig from '@boundlessgeo/sdk/components/MapConfig';
import Select from '@boundlessgeo/sdk/components/Select';
import DrawFeature from '@boundlessgeo/sdk/components/DrawFeature';
import LeftNav from '@boundlessgeo/sdk/components/LeftNav';
import Geolocation from '@boundlessgeo/sdk/components/Geolocation';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Rotate from '@boundlessgeo/sdk/components/Rotate';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import InfoPopup from '@boundlessgeo/sdk/components/InfoPopup';
import EditPopup from '@boundlessgeo/sdk/components/EditPopup';
import Globe from '@boundlessgeo/sdk/components/Globe';
import Legend from '@boundlessgeo/sdk/components/Legend';
import Login from '@boundlessgeo/sdk/components/Login';
import Header from '@boundlessgeo/sdk/components/Header';
import {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
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
  }
});

var locale = 'en';
var i18n = enMessages;

class QuickView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftNavOpen: false
    };
  }
  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
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
    const tabList = [
      <Tab
        disableTouchRipple={true}
        key={1}
        value={1}
        onActive={this.layerListOpen.bind(this)}
        label={formatMessage(messages.layerstab)}>
        <div id='layerlist'>
          <LayerList
            inlineDialogs={true}
            allowStyling={true}
            expandOnHover={false}
            icon={<FlatButton label="ADD"/>}
            showOnStart={true}
            addLayer={{open:this.state.addLayerOpen, onRequestClose:this.layerListClose.bind(this), allowUserInput: true, sources: [{url: 'https://demo.boundlessgeo.com/geoserver/wms', type: 'WMS', title: 'Demo GeoServer'}]}}
            allowFiltering={true}
            showOpacity={true}
            showDownload={true}
            showGroupContent={true}
            showZoomTo={true}
            allowReordering={true}
            map={map}/>
        </div>
      </Tab>,
      <Tab disableTouchRipple={true} key={2} value={2} label={formatMessage(messages.legendtab)}><div id='legend'><Legend map={map} /></div></Tab>,
      <Tab disableTouchRipple={true} key={3} value={3} label={formatMessage(messages.attributestab)}><div id="attributes-table-tab" style={{height: '100%'}}><FeatureTable toggleGroup='navigation' ref='table' map={map} /></div></Tab>
    ];
    var leftNavWidth = 360;
    var header = (
      <Header
        title='Boundless SDK Quickview'
        logo='boundless_icon_256x256.png'
        showLeftIcon={!this.state.leftNavOpen}
        style={{left: this.state.leftNavOpen ? leftNavWidth : 0, width: this.state.leftNavOpen ? 'calc(100% - ' + leftNavWidth + 'px)' : '100%'}}
        onLeftIconTouchTap={this.leftNavOpen.bind(this)}>
        <Measure toggleGroup='navigation' map={map}/>
        <Select toggleGroup='navigation' map={map}/>
        <Login />
        <Navigation toggleGroup='navigation' secondary={true} />
        <DrawFeature toggleGroup='navigation' map={map} />
        <MapConfig map={map}/>
      </Header>);
    return (
        <div id='content'>
          <LeftNav width={leftNavWidth} tabList={tabList} open={this.state.leftNavOpen} onRequestClose={this.leftNavClose.bind(this)}/>
          <div>
            {header}
            <div className='map' style={{left: this.state.leftNavOpen ? leftNavWidth : 0, width: this.state.leftNavOpen ? 'calc(100% - ' + leftNavWidth + 'px)' : '100%'}}>
              <MapPanel id='map' map={map} />
              <LoadingPanel map={map} />
              <div id='globe-button'><Globe map={map} /></div>
              <div id='editpopup' className='ol-popup'><EditPopup toggleGroup='navigation' map={map} /></div>
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

QuickView.childContextTypes = {
  muiTheme: React.PropTypes.object
};

QuickView = injectIntl(QuickView);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><QuickView /></IntlProvider>, document.getElementById('main'));
