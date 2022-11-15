import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView, View, Text, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../../components/Header';
import FormControl from '../../../components/FormControl';
import FormMessage from '../../../components/FormMessage';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';

import {
  postUserLogin, authPatchData,
  authPatchToken, authReset,
} from '../../../globalStates/actions/auth';

import { colors } from '../../../themes';
import styles from './styles';

function LoginScreen(props) {
  const {
    authResult, authIsLoading,
    authIsSuccess, authIsError,
  } = props;

  const [authInfoMessage, setAuthInfoMessage] = useState('');
  // FORM STATES
  const [email, setEmail] = useState({ valid: false, text: '' });
  const [password, setPassword] = useState({ valid: false, text: '' });
  // submitted state
  const [submitted, setSubmitted] = useState({ isSubmitted: false, isError: false, message: '' });

  // FORM REFERENCE
  const inputEmail = useRef(null);
  const inputPassword = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      resetAll();
    }, []),
  );

  useEffect(() => {
    if (authIsSuccess && authResult) {
      props.patchAuthData(authResult.user);
      props.patchAuthToken(authResult.token);
      props.resetAuth();
    }
  }, [authResult]);

  const onSubmit = () => {
    Keyboard.dismiss();
    setAuthInfoMessage('');
    setSubmitted((prev) => ({ ...prev, isSubmitted: true }));
    if (email.valid && password.valid) {
      const data = {
        email: email.text.trim().toLowerCase(),
        password: password.text,
      };
      props.postUserLogin(data);
    }
  };

  const onSetMessageInfo = (msg) => {
    setAuthInfoMessage(msg);
  };

  const resetInput = () => {
    props.resetAuth();
    setEmail((prev) => ({ ...prev, text: '' }));
    setPassword((prev) => ({ ...prev, text: '' }));
    setSubmitted((prev) => ({ ...prev, isSubmitted: false }));
  };

  const resetAll = () => {
    resetInput();
    props.resetAuth();
    // setAuthInfoMessage('');
  };

  const goToForgotPassword = () => {
    resetInput();
    setTimeout(() => props.navigation.navigate('ForgotPassword', { onSetMessageInfo }, 400));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidContainer}
        behavior="position"
        enabled
      >
        <FocusAwareStatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <Header style={{ backgroundColor: colors.white }} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.bodyContainer, styles.formContainer]}>
            <Text style={styles.headTitle}>Login</Text>
            <Text style={styles.headDesc}>Enter your e-mail address and password that have been sent by e-mail</Text>

            {/* show message error if any */}
            {authIsError && Boolean(authResult) && (
              <FormMessage type="danger" message={authResult} />
            )}

            {/* show message info if any */}
            {!authIsError && Boolean(authInfoMessage) && (
              <FormMessage type="success" message={authInfoMessage} />
            )}

            <FormControl
              label="Email"
              type="input"
              controlRef={inputEmail}
              controlValue={email}
              controlSetValue={setEmail}
              controlRegex={/^(([^<>()\\[\]\\.,:\s@"]+(\.[^<>()\\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}
              controlRegexError="Email is invalid"
              controlProps={{
                keyboardType: 'email-address',
                placeholder: 'email@domain.com',
                onSubmitEditing: () => inputPassword.current.focus(),
                returnKeyType: 'next',
                errorMessage: 'ENTER A VALID ERROR HERE',
                autoCapitalize: 'none',
              }}
              isRequired
              isSubmitted={submitted.isSubmitted}
            />

            <FormControl
              label="Password"
              type="password"
              controlRef={inputPassword}
              controlValue={password}
              controlSetValue={setPassword}
              controlProps={{
                placeholder: 'Password',
                returnKeyType: 'done',
                onSubmitEditing: onSubmit,
              }}
              isRequired
              isSubmitted={submitted.isSubmitted}
            />

            <Button
              title="Login"
              onPress={onSubmit}
              loading={authIsLoading}
              disabled={authIsLoading}
              buttonStyle={styles.button}
            />

            <View style={styles.linkWrapper}>
              <Text style={styles.text}>
                Forgot your password?
              </Text>

              <TouchableOpacity
                onPress={goToForgotPassword}
                disabled={authIsLoading}
              >
                <Text
                  style={[
                    styles.linkText,
                    authIsLoading && styles.linkTextDisabled,
                  ]}
                >
                  Click here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function bindAction(dispatch) {
  return {
    postUserLogin: (e) => dispatch(postUserLogin(e)),
    patchAuthData: (e) => dispatch(authPatchData(e)),
    patchAuthToken: (e) => dispatch(authPatchToken(e)),
    resetAuth: () => dispatch(authReset()),
  };
}

function mapStateToProps({ auth }) {
  const {
    authResult, authState,
  } = auth;

  return {
    authResult,
    authIsLoading: authState === 'loading',
    authIsSuccess: authState === 'success',
    authIsError: authState === 'error',
  };
}

export default connect(
  mapStateToProps,
  bindAction,
)(LoginScreen);
