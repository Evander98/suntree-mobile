/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import useAppState from 'react-native-appstate-hook';

import AppContext from '../globalStates/AppContext';
import { introSetupInit } from '../globalStates/actions/appConfig';
// import { postNotificationRegister } from '../globalStates/actions/appConfig';

import LoadingScreen from './LoadingScreen';
import WelcomeScreen from './WelcomeScreen';
import AboutAppsScreen from './AboutAppsScreen';

import LoginScreen from './_Auth/LoginScreen';
import ForgotPasswordScreen from './_Auth/ForgotPasswordScreen';
// import ResetPasswordScreen from './_Auth/ResetPasswordScreen';
import DashboardScreen from './_Dashboard';
import WebviewScreen from './WebviewScreen';
import EditProfileScreen from './_Profile/EditProfileScreen';
import ChangePasswordScreen from './_Profile/ChangePasswordScreen';
import LJListScreen from './_LearningJourney/LJListScreen';
import LJDetailScreen from './_LearningJourney/LJDetailScreen';
import LJActionScreen from './_LearningJourney/LJActionScreen';
import ProgramDetailScreen from './_Program/ProgramDetailScreen';
import ModuleDetailScreen from './_Module/ModuleDetailScreen';
import SectionDetailScreen from './_Section/SectionDetailScreen';
import SectionTypeHandlerScreen from './_SectionType';

import { getMe } from '../globalStates/actions/auth';

// import { ModAsyncStorage, DISPLAYED_WELCOMESCREEN } from '../utils/asyncStorageHelper';

const Stack = createStackNavigator();

function RootScreen(props) {
  const {
    userToken,
    userData,

    introSetup,
  } = props;

  const toast = useContext(AppContext.ToastContext);

  const { appState } = useAppState();

  // // activate next line to remove async storage of welcome screen
  // useEffect(() => {
  //   props.introSetupInit();
  //   ModAsyncStorage.delete(DISPLAYED_WELCOMESCREEN); //@@@@@
  // }, []);

  useEffect(() => {
    if (userToken) {
      console.bugsnag.setUser(userData.id, userData.username, userData.email); // eslint-disable-line
    } else {
      console.bugsnag.clearUser(); // eslint-disable-line
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      props.getMe(userToken);
    }
  }, [userToken]);

  return (
    <Stack.Navigator
      initialRouteName="Loading"
      headerMode="none"
      screenOptions={{ gestureEnabled: false }}
    >
      {introSetup && (
        <>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </>
      )}

      {userToken == null
        ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            {/* <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
          </>
        )
        : (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="LJActionScreen" component={LJActionScreen} />
            <Stack.Screen name="Webview" component={WebviewScreen} />

            <Stack.Screen name="ProgramDetail" component={ProgramDetailScreen} initialParams={{ toast }} />
            <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} initialParams={{ toast }} />
            <Stack.Screen name="SectionDetail" component={SectionDetailScreen} initialParams={{ toast }} />

            <Stack.Screen name="SectionTypeHandler" component={SectionTypeHandlerScreen} initialParams={{ toast }} />

            <Stack.Screen name="EditProfile" component={EditProfileScreen} initialParams={{ toast }} />
            <Stack.Screen name="LearningJourney" component={LJListScreen} />
            <Stack.Screen name="LearningJourneyDetail" component={LJDetailScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} initialParams={{ toast }} />

            <Stack.Screen name="AboutApps" component={AboutAppsScreen} />
          </>
        )}
    </Stack.Navigator>
  );
}

function bindActions(dispatch) {
  return {
    getMe: (e) => dispatch(getMe(e)),
    introSetupInit: () => dispatch(introSetupInit()),
    // registerNotification: (accessToken, data) => dispatch(postNotificationRegister(accessToken, data)),
  };
}

function mapStateToProps({ auth, appConfig }) {
  const { introSetup } = appConfig;
  const { userToken, userData } = auth;

  return {
    userToken,
    userData,

    introSetup,
  };
}

export default connect(
  mapStateToProps,
  bindActions,
)(RootScreen);
