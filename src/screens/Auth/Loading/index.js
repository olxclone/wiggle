import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../../../context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export default function Loading({navigation}) {
  const [fcm, setFcm] = useState('');
  let user = useContext(AuthContext);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        messaging()
          .getToken()
          .then(fcm => setFcm(fcm));
        firestore().collection('users').doc(auth().currentUser.uid).update({
          token: fcm,
        });
        navigation.navigate('photogram.dashboard.screen');
      } else {
        navigation.navigate('photogram.login.screen');
      }
    });
  });
  return (
    <View>
      <Text>photogram</Text>
    </View>
  );
}
