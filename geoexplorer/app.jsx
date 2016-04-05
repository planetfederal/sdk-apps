import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider, defineMessages, injectIntl, intlShape} from 'react-intl';
import App from './node_modules/boundless-sdk/js/components/App.js';
import ToolActions from './node_modules/boundless-sdk/js/actions/ToolActions.js';
import LayerList from './node_modules/boundless-sdk/js/components/LayerList.jsx';
import FeatureTable from './node_modules/boundless-sdk/js/components/FeatureTable.jsx';
import Measure from './node_modules/boundless-sdk/js/components/Measure.jsx';
import LoadingPanel from './node_modules/boundless-sdk/js/components/LoadingPanel.jsx';
import MapConfig from './node_modules/boundless-sdk/js/components/MapConfig.jsx';
import Select from './node_modules/boundless-sdk/js/components/Select.jsx';
import QueryBuilder from './node_modules/boundless-sdk/js/components/QueryBuilder.jsx';
import Geolocation from './node_modules/boundless-sdk/js/components/Geolocation.jsx';
import HomeButton from './node_modules/boundless-sdk/js/components/HomeButton.jsx';
import InfoPopup from './node_modules/boundless-sdk/js/components/InfoPopup.jsx';
import AddLayer from './node_modules/boundless-sdk/js/components/AddLayer.jsx';
import Toolbar from './node_modules/boundless-sdk/js/components/Toolbar.jsx';
import Globe from './node_modules/boundless-sdk/js/components/Globe.jsx';
import Legend from './node_modules/boundless-sdk/js/components/Legend.jsx';
import Login from './node_modules/boundless-sdk/js/components/Login.jsx';
import UI from 'pui-react-tabs';
import enLocaleData from './node_modules/react-intl/locale-data/en.js';
import enMessages from './node_modules/boundless-sdk/locale/en.js';

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
  _navigationFunc() {
    ToolActions.activateTool(null, 'navigation');
  }
  render() {
    const {formatMessage} = this.props.intl;
    var options = [{
      jsx: (<Login />)
    }, {
      jsx: (<Measure toggleGroup='navigation' map={map}/>)
    }, {
      jsx: (<AddLayer map={map} />)
    }, {
      jsx: (<Select toggleGroup='navigation' map={map}/>)
    }, {
      text: formatMessage(messages.navigationbutton),
      title: formatMessage(messages.navigationbuttontitle),
      onClick: this._navigationFunc.bind(this),
      icon: 'hand-paper-o'
    }, {
      jsx: (<MapConfig map={map}/>)
    }];
    return (
      <article>
        <Toolbar options={options} />
        <div id='content'>
          <div className='row full-height'>
            <div className='col-md-9 full-height' id='tabs-panel'>
              <UI.SimpleTabs defaultActiveKey={1}>
                <UI.Tab eventKey={1} title={formatMessage(messages.layerstab)}><div id='layerlist'><LayerList allowStyling={true} expandOnHover={false} showOnStart={true} addLayer={{allowUserInput: true, url: '/geoserver/wms'}} allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div></UI.Tab>
                <UI.Tab eventKey={2} title={formatMessage(messages.legendtab)}><div id='legend'><Legend map={map} /></div></UI.Tab>
                <UI.Tab eventKey={3} title={formatMessage(messages.attributestab)}><div id="attributes-table-tab"><FeatureTable resizeTo='tabs-panel' offset={[50, 60]} map={map} /></div></UI.Tab>
                <UI.Tab eventKey={4} title={formatMessage(messages.querytab)}><div id='query-panel' className='query-panel'><QueryBuilder map={map} /></div></UI.Tab>
              </UI.SimpleTabs>
            </div>
            <div className='col-md-15 full-height'>
              <div id='map' ref='map'></div>
              <LoadingPanel map={map} />
              <div id='globe-button' className='ol-unselectable ol-control'><Globe map={map} /></div>
              <div id='popup' className='ol-popup'><InfoPopup infoFormat='application/vnd.ogc.gml' toggleGroup='navigation' map={map} /></div>
              <div id='geolocation-control' className='ol-unselectable ol-control'><Geolocation map={map} /></div>
              <div id='home-button' className='ol-unselectable ol-control'><HomeButton map={map} /></div>
            </div>
          </div>
        </div>
      </article>
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
