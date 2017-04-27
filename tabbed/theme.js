import {cyan700, lightBlack, pinkA200, grey100, grey500, darkBlack, white, lime100, grey300, cyan500} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import zIndex from 'material-ui/styles/zIndex';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing: spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#28728D',
    primary2Color: cyan700,
    primary3Color: lightBlack,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: lime100,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
  }
};
