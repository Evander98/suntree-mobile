import { StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import { globalStyles, colors, fonts } from '../../../themes';

export default StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  bodyContainer: {
    ...globalStyles.bodyContainer,
  },
  keyboardAvoidContainer: {},
  formContainer: {
    marginTop: responsiveHeight(12),
  },
  button: {
    marginVertical: responsiveHeight(3),
  },
  linkWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.fontFamily.OpenSansRegular,
  },
  linkText: {
    marginHorizontal: responsiveWidth(1),
    fontFamily: fonts.fontFamily.OpenSansBold,
    color: colors.primary,
  },
  linkTextDisabled: {
    color: colors.grey,
  },
  headTitle: {
    fontFamily: fonts.fontFamily.OpenSansBold,
    fontSize: fonts.sizes.upsize,
    marginBottom: responsiveHeight(1),
  },
  headDesc: {
    fontFamily: fonts.fontFamily.OpenSansRegular,
    marginBottom: responsiveHeight(3),
  },
});
