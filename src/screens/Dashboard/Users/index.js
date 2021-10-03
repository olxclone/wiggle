import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {AllUsers} from '../../../components';

export default function Users({route}) {


  return (
    <View>
      <FlatList
        data={route.params.members}
        renderItem={({item}) => {
          return <AllUsers item={item} />;
        }}
      />
    </View>
  );
}
