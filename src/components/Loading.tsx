import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '../themes';

const Loading = () => {
  return (
    <View className="flex-row justify-center p-8">
      <ActivityIndicator size={'large'} color={colors.button} />
    </View>
  );
};

export default Loading;
