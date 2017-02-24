import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import MapPanel from 'boundless-sdk/components/MapPanel';
import HomeButton from 'boundless-sdk/components/HomeButton';
import Zoom from 'boundless-sdk/components/Zoom';
import LayerList from 'boundless-sdk/components/LayerList';
import AppBar from 'material-ui/AppBar';
import enLocaleData from 'react-intl/locale-data/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import BaseMapConfigService from 'boundless-sdk/services/BaseMapConfigService';
import BCSService from 'boundless-sdk/services/BCSService';
import enMessages from 'boundless-sdk/locale/en';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  enLocaleData
);
var apikey = '';

var group = new ol.layer.Group({
  type: 'base-group',
  title: 'Base maps'
});

const initialLayer = 'Mapbox Satellite';

var map = new ol.Map({
  loadTilesWhileAnimating: true,
  layers: [group],
  controls: [new ol.control.Attribution({collapsible: true})],
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileServices: []
    };
  }
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  componentDidMount() {
    var me = this;
    BCSService.getTileServices(apikey, function(tileServices) {
      for (var i = 0, ii = tileServices.length; i < ii; ++i) {
        if (tileServices[i].name === initialLayer) {
          group.getLayers().push(BaseMapConfigService.createLayer(tileServices[i]));
          break;
        }
      }
      me.setState({
        tileServices: tileServices
      });
    });
  }
  render() {
    return (
      <div id='content'>
        <AppBar iconElementLeft={<img style={{marginTop: '10px'}} src="resources/logo.svg" width="30" height="30" />} title="BCS Basemaps" />
        <MapPanel id='map' map={map} useHistory={false} />
        <div><LayerList addBaseMap={{tileServices: this.state.tileServices}} showOnStart={true} showZoomTo={true} allowReordering={true} expandOnHover={false} map={map} /></div>
        <div id='home-button'><HomeButton map={map} /></div>
        <div id='zoom-buttons'><Zoom map={map} /></div>
      </div>
    );
  }
}

MyApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp /></IntlProvider>, document.getElementById('main'));
