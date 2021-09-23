import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../../../context';

export default function Loading({navigation}) {
  let user = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigation.navigate('photogram.dashboard.screen');
    } else {
      navigation.navigate('photogram.login.screen');
    }
  });
  return (
    <View>
      <Text>photogram</Text>
    </View>
  );
}
