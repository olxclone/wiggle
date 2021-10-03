/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {View, Text, Image} from 'react-native';
import {width, height} from '../../../constants/Dimesions';

export default function MessageCard({item, navigation}) {
  let [user, setUser] = useState();

  let getUser = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(item.uid)
        .get()
        .then(_user => {
          setUser(_user);
        });
    } catch (e) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View
      style={{
        padding: item.image ? 4 : 14,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: item.uid === auth().currentUser.uid ? 18 : 0,
        marginTop: 4,
        borderBottomRightRadius: item.uid === auth().currentUser.uid ? 0 : 18,
        marginRight: item.uid === auth().currentUser.uid ? 4 : width / 2.5,
        marginLeft: item.uid === auth().currentUser.uid ? width / 2.5 : 4,
        alignSelf:
          item.uid !== auth().currentUser.uid ? 'flex-start' : 'flex-end',
        backgroundColor:
          item.uid === auth().currentUser?.uid ? 'yellow' : 'white',
      }}>
      <Image
        style={{
          height: item.image ? height / 4 : 0,
          width: item.image ? width / 2 : 0,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          borderBottomLeftRadius: 18,
        }}
        source={{uri: item.image ? item.image : null}}
      />
      <Text
        style={{
          fontFamily: 'Lato-Regular',
          textAlign: item.uid === auth().currentUser.uid ? 'right' : 'left',
        }}>
        {item.messageText}
      </Text>
    </View>
  );
}
