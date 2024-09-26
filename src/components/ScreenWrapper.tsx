import {
  View,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, {Component, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
type ScreenWrapperProps = {
  children: JSX.Element | JSX.Element[];
};

const ScreenWrapper = ({children}: ScreenWrapperProps) => {
  let statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : Platform.OS === 'ios'
    ? 30
    : 0;
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>(false);
  const [keyboardHeigth, setKeyboardHeigth] = useState<number>(0);

  useEffect(() => {
    SystemNavigationBar.setNavigationColor('#f2f2f2', 'dark', 'navigation');
    SystemNavigationBar.setFitsSystemWindows();
    // SystemNavigationBar.navigationHide();
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardStatus(true);
      setKeyboardHeigth(e.endCoordinates.height);
      // console.log(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
      setKeyboardHeigth(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <SafeAreaView>
      <View
        style={{
          paddingTop: statusBarHeight,
        }}
        className="h-full">
        {children}
        <StatusBar barStyle={'dark-content'} backgroundColor={'#f2f2f2'} />
      </View>
    </SafeAreaView>
  );
};

export default ScreenWrapper;
