import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FloatingAction} from 'react-native-floating-action';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {LaunchCard} from '../../../components';

export default function Launch({navigation}) {
  const [groups, setGroups] = useState([]);

  let styles = StyleSheet.create({
    actionButtonIcon: {
      fontSize: 20,
      height: 22,
      color: 'white',
    },
  });
  const actions = [
    {
      text: 'Create a wiggle room',
      icon: <Ionicons name="create-outline" style={styles.actionButtonIcon} />,
      name: 'create',
      position: 1,
    },
    {
      text: 'Join to a wiggle room',
      icon: (
        <Ionicons name="person-add-outline" style={styles.actionButtonIcon} />
      ),
      name: 'join',
      position: 2,
    },
  ];

  let fetchGroups = async () => {
    let Lists = [];

    try {
      await firestore()
        .collection('groups')
        .where('members', 'array-contains', auth().currentUser.uid)
        .limit(3)
        .get()
        .then(_doc => {
          _doc.docs.forEach(data => {
            let {
              description,
              groupName,
              groupImage,
              ownerUid,
              members,
              createdAt,
            } = data.data();
            Lists.push({
              description,
              groupName,
              id: data.id,
              groupImage,
              ownerUid,
              members,
              createdAt,
            });
            setGroups(Lists);
          });
        });
    } catch (error) {}
  };

  useEffect(() => {
    fetchGroups();
  });

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={groups}
        renderItem={({item}) => {
          return <LaunchCard item={item} />;
        }}
      />
      <FloatingAction
        actions={actions}
        color="#45A4F9"
        dismissKeyboardOnPress
        overlayColor="rgba(0,0,0,0.19)"
        onPressItem={name => {
          if (name === 'create') {
            navigation.navigate('photogram.create.screen');
          } else {
            navigation.navigate('photogram.join.screen');
          }
        }}
      />
    </View>
  );
}
