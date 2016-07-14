import React from 'react';
import ol from 'openlayers';
import ToolUtil from 'boundless-sdk/js/toolutil.js';
import AppDispatcher from 'boundless-sdk/js//dispatchers/AppDispatcher.js';
import ToolActions from 'boundless-sdk/js/actions/ToolActions.js';
import RaisedButton from 'boundless-sdk/js/components/Button.jsx';

class DrawBox extends React.Component {
  constructor(props) {
    super(props);
    this._dispatchToken = ToolUtil.register(this);
    var source = new ol.source.Vector({wrapX: false});
    this._interaction = new ol.interaction.Draw({
      source: source,
      type: 'LineString',
      geometryFunction: function(coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        var start = coordinates[0];
        var end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      },
      maxPoints: 2
    });
    this._layer = new ol.layer.Vector({
      popupInfo: '#AllAttributes',
      title: null, /* to keep it out of the LayerList */
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: this.props.strokeColor
        })
      }),
      source: source,
      zIndex: 100000
    });
    source.on('addfeature', function(evt) {
      evt.feature.set('AREA', evt.feature.getGeometry().getArea());
      ToolActions.showPopup(evt.feature, this._layer);
      AppDispatcher.handleAction({
        type: 'DRAWBOX',
        geometry: evt.feature.getGeometry()
      });
    }, this);
    this.props.map.addLayer(this._layer);
  }
  componentWillUnmount() {
    AppDispatcher.unregister(this._dispatchToken);
  }
  activate(interactions) {
    ToolUtil.activate(this, interactions);
  }
  deactivate() {
    ToolUtil.deactivate(this);
  }
  _drawBox() {
    this.activate(this._interaction); 
  }
  render() {
    return (
     <RaisedButton {...this.props} label='Draw Box' tooltip='Click in the map and move the mouse to draw a box' onTouchTap={this._drawBox.bind(this)} />
    );
  }
}

DrawBox.propTypes = {
  strokeColor: React.PropTypes.string
};

DrawBox.defaultProps = {
  strokeColor: '#FF0000'
};

export default DrawBox;
