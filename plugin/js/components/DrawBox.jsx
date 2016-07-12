import React from 'react';
import ol from 'openlayers';
import MapTool from 'boundless-sdk/js/components/MapTool.js';
import RaisedButton from 'boundless-sdk/js/components/Button.jsx';

class DrawBox extends MapTool {
  constructor(props) {
    super(props);
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
      title: null, /* to keep it out of the LayerList */
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: this.props.strokeColor
        })
      }),
      source: source,
      zIndex: 100000
    });
    this.props.map.addLayer(this._layer);
  }
  _drawBox() {
    this.activate(this._interaction); 
  }
  render() {
    return (
     <RaisedButton label='Draw Box' tooltip='Click in the map and move the mouse to draw a box' onTouchTap={this._drawBox.bind(this)} />
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
