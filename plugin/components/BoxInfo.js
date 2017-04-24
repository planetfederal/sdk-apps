import React from 'react';
import AppDispatcher from '@boundlessgeo/sdk/dispatchers/AppDispatcher';

class BoxInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxInfo: []
    };
    var me = this;
    AppDispatcher.register((payload) => {
      let action = payload.action;
      switch (action.type) {
        case 'DRAWBOX':
          var geom = action.geometry;
          var start = 0;
          // only show 5 last entries
          if (me.state.boxInfo.length > 4) {
            start = me.state.boxInfo.length - 4;
          }
          var boxInfo = me.state.boxInfo.slice(start);
          boxInfo.push(this.props.tplText.replace('{area}', geom.getArea()));
          me.setState({boxInfo: boxInfo});
          break;
        default:
          break;
      }
    });

  }
  render() {
    var boxInfo = [];
    boxInfo.push(<p style={{margin: 0, backgroundColor: 'grey'}} key='header'>{this.props.title}</p>);
    for (var i = 0, ii = this.state.boxInfo.length; i < ii; ++i) {
      boxInfo.push(<span key={i}>{this.state.boxInfo[i]}<br/></span>);
    }
    return (<div>{boxInfo}</div>);
  }
}

BoxInfo.propTypes = {
  title: React.PropTypes.string,
  tplText: React.PropTypes.string
};


BoxInfo.defaultProps = {
  title: 'Box info',
  tplText: 'Area: {area}'
};

export default BoxInfo;
