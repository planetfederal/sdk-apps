import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import LayerList from 'boundless-sdk/components/LayerList';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import FeatureTable from 'boundless-sdk/components/FeatureTable';
import Measure from 'boundless-sdk/components/Measure';
import LoadingPanel from 'boundless-sdk/components/LoadingPanel';
import MapPanel from 'boundless-sdk/components/MapPanel';
import MapConfig from 'boundless-sdk/components/MapConfig';
import Select from 'boundless-sdk/components/Select';
import WFST from 'boundless-sdk/components/WFST';
import LeftNav from 'boundless-sdk/components/LeftNav';
import Geolocation from 'boundless-sdk/components/Geolocation';
import Zoom from 'boundless-sdk/components/Zoom';
import Rotate from 'boundless-sdk/components/Rotate';
import HomeButton from 'boundless-sdk/components/HomeButton';
import InfoPopup from 'boundless-sdk/components/InfoPopup';
import Globe from 'boundless-sdk/components/Globe';
import Legend from 'boundless-sdk/components/Legend';
import Login from 'boundless-sdk/components/Login';
// import Header from 'boundless-sdk/components/Header';
import {Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Navigation from 'boundless-sdk/components/Navigation';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from 'boundless-sdk/locale/en';
import injectTapEventPlugin from 'react-tap-event-plugin';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

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
  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }
  handleChange(value) {
    this.refs.table.getWrappedInstance().setActive(value === 3);
    this.refs.edit.getWrappedInstance().setActive(value === 4);
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
    });
  }
  leftNavClose(value) {
    this.setState({
      leftNavOpen: false
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
            addLayer={{isDrawer:true, open:this.state.addLayerOpen, onRequestClose:this.layerListClose.bind(this), allowUserInput: true, sources: [{url: '/geoserver/wms', type: 'WMS', title: 'Local GeoServer'}]}}
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
      <Tab disableTouchRipple={true} key={3} value={3} label={formatMessage(messages.attributestab)}><div id="attributes-table-tab" style={{height: '100%'}}><FeatureTable ref='table' map={map} /></div></Tab>,
      <Tab disableTouchRipple={true} key={4} value={4} label={formatMessage(messages.wfsttab)}><div id='wfst'><WFST ref='edit' toggleGroup='navigation' showEditForm={true} map={map} /></div></Tab>
    ];
    var toolBar = (<Toolbar>
                <MapConfig firstChild={true} map={map}/>
                <Measure toggleGroup='navigation' map={map}/>
                <Select toggleGroup='navigation' map={map}/>
                <Navigation secondary={true} toggleGroup='navigation' toolId='nav' />
                <ToolbarGroup lastChild={true}>
                  <Login />
                </ToolbarGroup>
              </Toolbar>);
    // var headerMenuItems = [
    //   <MenuItem primaryText="Load" />,
    //   <MenuItem primaryText="Save" />,
    //   <MenuItem primaryText="Login" />];
    // var header = (  <Header
    //     title='Boundless SDK Quickview'
    //     leftMenuItems={headerMenuItems}
    //     onLeftIconTouchTap={this.leftNavOpen.bind(this)}/>);
    return (
        <div id='content'>
          <div className="row container">
            <div className="col tabs" id="tabspanel">
              <LeftNav tabList={tabList} open={this.state.leftNavOpen} onRequestClose={this.leftNavClose.bind(this)}/>
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

QuickView.childContextTypes = {
  muiTheme: React.PropTypes.object
};

QuickView = injectIntl(QuickView);

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><QuickView /></IntlProvider>, document.getElementById('main'));
