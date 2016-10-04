import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import Globe from 'boundless-sdk/js/components/Globe.jsx';
import LegendIcon from 'material-ui/svg-icons/image/image';
import Legend from 'boundless-sdk/js/components/Legend.jsx';
import PanelButton from 'boundless-sdk/js/components/PanelButton.jsx';
import QGISPrint from 'boundless-sdk/js/components/QGISPrint.jsx';
import Zoom from 'boundless-sdk/js/components/Zoom.jsx';
import Rotate from 'boundless-sdk/js/components/Rotate.jsx';
import HomeButton from 'boundless-sdk/js/components/HomeButton.jsx';
import MapPanel from 'boundless-sdk/js/components/MapPanel.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LayerList from 'boundless-sdk/js/components/LayerList.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import enLocaleData from 'react-intl/locale-data/en.js';
import enMessages from 'boundless-sdk/locale/en.js';
import InfoPopup from 'boundless-sdk/js/components/InfoPopup.jsx';
import MapConfigTransformService from 'boundless-sdk/js/services/MapConfigTransformService.js';
import MapConfigService from 'boundless-sdk/js/services/MapConfigService.js';
import Navigation from 'boundless-sdk/js/components/Navigation.jsx';
import Measure from 'boundless-sdk/js/components/Measure.jsx';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var printLayouts = [{
  name: 'Layout 1',
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
}];

addLocaleData(
  enLocaleData
);

var config = {"defaultSourceType": "gxp_wmscsource", "about": {"abstract": "", "title": "DHH_testmap"}, "map": {"layers": [{"opacity": 1.0, "group": "background", "name": "mapnik", "selected": true, "visibility": true, "source": "0", "fixed": true, "type": "OpenLayers.Layer.OSM"}, {"opacity": 1.0, "name": "geonode:DHH_facilites", "selected": true, "visibility": true, "source": "1", "getFeatureInfo": {"fields": ["FacilityID", "FacilityNa", "Tier", "IsFacility", "FacilityTy", "FacilityT0", "RegionName", "RegionID", "ParishName", "ParishID", "Longitude", "Latitude", "IsFacilit0", "UpdateDate", "Old_GMS_Fa", "QueryDateT", "ParentChil", "ParentID", "ChildID", "ChildName", "ParentName", "Evacuation", "OperatingS", "PowerStatu", "PowerStat0", "FuelStatus", "FuelStatu0", "Beds"], "propertyNames": {"FacilityID": null, "RegionID": null, "FuelStatus": null, "IsFacilit0": null, "UpdateDate": null, "Evacuation": null, "Latitude": null, "ChildID": null, "ParishID": null, "ParentName": null, "ChildName": null, "ParishName": null, "FacilityTy": null, "RegionName": null, "OperatingS": null, "Longitude": null, "Beds": null, "Tier": null, "FuelStatu0": null, "ParentChil": null, "IsFacility": null, "FacilityNa": null, "PowerStat0": null, "QueryDateT": null, "FacilityT0": null, "ParentID": null, "PowerStatu": null, "Old_GMS_Fa": null}}, "fixed": false, "schema": [{"visible": true, "name": "the_geom"}, {"visible": true, "name": "FacilityID"}, {"visible": true, "name": "FacilityNa"}, {"visible": true, "name": "Tier"}, {"visible": true, "name": "IsFacility"}, {"visible": true, "name": "FacilityTy"}, {"visible": true, "name": "FacilityT0"}, {"visible": true, "name": "RegionName"}, {"visible": true, "name": "RegionID"}, {"visible": true, "name": "ParishName"}, {"visible": true, "name": "ParishID"}, {"visible": true, "name": "Longitude"}, {"visible": true, "name": "Latitude"}, {"visible": true, "name": "IsFacilit0"}, {"visible": true, "name": "UpdateDate"}, {"visible": true, "name": "Old_GMS_Fa"}, {"visible": true, "name": "QueryDateT"}, {"visible": true, "name": "ParentChil"}, {"visible": true, "name": "ParentID"}, {"visible": true, "name": "ChildID"}, {"visible": true, "name": "ChildName"}, {"visible": true, "name": "ParentName"}, {"visible": true, "name": "Evacuation"}, {"visible": true, "name": "OperatingS"}, {"visible": true, "name": "PowerStatu"}, {"visible": true, "name": "PowerStat0"}, {"visible": true, "name": "FuelStatus"}, {"visible": true, "name": "FuelStatu0"}, {"visible": true, "name": "Beds"}]}], "center": [-10243217.3215486, 3829500.23629655], "units": "m", "maxResolution": 156543.03390625, "maxExtent": [-20037508.34, -20037508.34, 20037508.34, 20037508.34], "zoom": 5, "projection": "EPSG:900913"}, "id": 55, "sources": {"1": {"ptype": "gxp_wmscsource", "url": "http://exchange-dev.boundlessps.com/geoserver/wms", "restUrl": "/gs/rest", "isVirtualService": false, "title": "Local Geoserver"}, "0": {"ptype": "gxp_osmsource"}, "3": {"ptype": "gxp_olsource"}, "2": {"url": "http://exchange-dev.boundlessps.com/geoserver/wms", "restUrl": "/gs/rest", "ptype": "gxp_wmscsource", "title": "Local Geoserver"}, "4": {"url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/", "remote": true, "ptype": "gxp_wmscsource", "name": "ESRI"}}};

var map = new ol.Map({
  controls: [new ol.control.Attribution({collapsible: false})],
  view: new ol.View({
    center: [0, 0],
    zoom: 4
  })
});

var result = MapConfigTransformService.transform(config);
MapConfigService.load(result, map);

class MyApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    };
  }
  render() {
    return (
       <div id='content'>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <Navigation secondary={true} toggleGroup='navigation' toolId='nav' />
          </ToolbarGroup>
          <QGISPrint map={map} layouts={printLayouts} />
          <ToolbarGroup lastChild={true}>
            <Measure toggleGroup='navigation' map={map}/>
          </ToolbarGroup>
        </Toolbar>
        <MapPanel id='map' map={map} />
        <div id='globe-button'><Globe tooltipPosition='right' map={map} /></div>
        <div><PanelButton className='legenddiv' contentClassName='legendcontent' buttonClassName='legend-button' icon={<LegendIcon />} tooltipPosition='top-left' buttonTitle='Show legend' map={map} content={<Legend map={map} />}/></div>
        <div id='home-button'><HomeButton tooltipPosition='right' map={map} /></div>
        <div><LayerList tooltipPosition='top-left' allowStyling={true} map={map} /></div>
        <div id='zoom-buttons'><Zoom tooltipPosition='right' map={map} /></div>
        <div id='rotate-button'><Rotate tooltipPosition='top-left' map={map} /></div>
        <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' toolId='nav' infoFormat='application/vnd.ogc.gml' map={map} /></div>
      </div>
    );
  }
}

MyApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale='en' messages={enMessages}><MyApp /></IntlProvider>, document.getElementById('main'));
