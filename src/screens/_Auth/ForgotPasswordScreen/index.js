import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView, View, Text, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard, TouchableOpacity,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../../components/Header';
import FormControl from '../../../components/FormControl';
import FormMessage from '../../../components/FormMessage';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';

import {
  postRequestResetPass,
  forgotPassReset,
} from '../../../globalStates/actions/auth';

import { colors } from '../../../themes';
import styles from './styles';

function ForgotPasswordScreen(props) {
  const {
    forgotPassResult, forgotPassIsLoading,
    forgotPassIsSuccess, forgotPassIsError,
  } = props;

  // FORM STATES
  const [email, setEmail] = useState({ valid: false, text: '' });
  // submitted state
  const [submitted, setSubmitted] = useState({ isSubmitted: false, isError: false, message: '' });

  // FORM REFERENCE
  const inputEmail = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        resetAll();
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      resetAll();

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  useEffect(() => {
    resetAll();
  }, []);

  useEffect(() => {
    if (forgotPassIsSuccess && forgotPassResult && forgotPassResult.success) {
      resetAll('Reset password request has sent');
      props.navigation.goBack();
      props.resetForgotPass();
    }
  }, [forgotPassResult]);

  const onSubmit = () => {
    Keyboard.dismiss();
    setSubmitted((prev) => ({ ...prev, isSubmitted: true }));
    if (email.valid) {
      const data = {
        email: email.text.trim().toLowerCase(),
      };
      props.postRequestResetPass(data);
    }
    // props.navigation.navigate('ResetPassword');
  };

  const resetInput = () => {
    setEmail((prev) => ({ ...prev, text: '' }));
  };

  const resetAll = (msg = '') => {
    resetInput();
    props.resetForgotPass();
    setTimeout(() => props.route.params.onSetMessageInfo(msg), 500);
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
            <Text style={styles.headTitle}>Forgot the password</Text>
            <Text style={styles.headDesc}>Enter your email address to get an account password reset email notification</Text>

            {/* show message error if any */}
            {forgotPassIsError && Boolean(forgotPassResult) && (
              <FormMessage type="danger" message={forgotPassResult} />
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
                returnKeyType: 'next',
                errorMessage: 'ENTER A VALID ERROR HERE',
                autoCapitalize: 'none',
              }}
              isRequired
              isSubmitted={submitted.isSubmitted}
            />

            <Button
              title="Send"
              onPress={onSubmit}
              loading={forgotPassIsLoading}
              disabled={forgotPassIsLoading}
              buttonStyle={styles.button}
            />

            <View style={styles.linkWrapper}>
              <Text style={styles.text}>
                Already have an account?
              </Text>

              <TouchableOpacity
                onPress={() => props.navigation.navigate('Login')}
                disabled={forgotPassIsLoading}
              >
                <Text
                  style={[
                    styles.linkText,
                    forgotPassIsLoading && styles.linkTextDisabled,
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
    postRequestResetPass: (e) => dispatch(postRequestResetPass(e)),
    resetForgotPass: () => dispatch(forgotPassReset()),
  };
}

function mapStateToProps({ auth }) {
  const {
    forgotPassResult, forgotPassState,
  } = auth;
  return {
    forgotPassResult,
    forgotPassIsLoading: forgotPassState === 'loading',
    forgotPassIsSuccess: forgotPassState === 'success',
    forgotPassIsError: forgotPassState === 'error',
  };
}

export default connect(
  mapStateToProps,
  bindAction,
)(ForgotPasswordScreen);
