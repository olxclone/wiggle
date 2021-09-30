/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import GroupsListCard from '../../../../components/Cards/GroupsList';
import {height, width} from '../../../../constants';

export default function Join({navigation}) {
  const [groups, setGroups] = useState([]);
  const [groupNameId, setGroupName] = useState('');

  let FetchGroups = async () => {
    let Lists = [];
    try {
      await firestore()
        .collection('groups')
        .where('members', '!=', [auth().currentUser.uid])
        .onSnapshot(val => {
          console.log(val.size);
          val.docs.forEach(data => {
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

  let searchForGroups = () => {};

  useEffect(() => {
    FetchGroups();
  }, []);

  let styles = StyleSheet.create({
    title: {
      fontSize: height / 14,
      marginHorizontal: 24,
      marginVertical: 18,
      fontFamily: 'Lato-Bold',
    },
    searchInput: {
      marginHorizontal: 24,
      fontFamily: 'Lato-Bold',

      borderRadius: 8,
      marginRight: 44,
      padding: 14,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  });

  return (
    <View style={{flex: 1, height: height, backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: '#45A4FF',
          height,
          borderTopStartRadius: 24,
        }}>
        <FlatList
          data={groups}
          contentContainerStyle={{marginTop: 12, marginBottom: 12}}
          renderItem={({item}) => {
            return <GroupsListCard navigation={navigation} item={item} />;
          }}
        />
      </View>
    </View>
  );
}
