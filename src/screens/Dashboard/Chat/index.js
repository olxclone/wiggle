/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GiftedChat} from 'react-native-gifted-chat';
import {width, height} from '../../../constants/Dimesions/index';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MessageCard from '../../../components/Cards/MessageCard';
import ImageCropPicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Chat(props) {
  let [imageUri, setImageUri] = useState('');
  let [imageUrl, setImageUrl] = useState('');
  let [userForToken, setUserForToken] = useState([]);
  let [tokens, setTokens] = useState('');
  let [messageText, setMessageText] = useState('');
  let [messages, setMessages] = useState([]);

  let fetchMessages = useCallback(async () => {
    try {
      await firestore()
        .collection('groups')
        .doc(props.route.params.id)
        .collection('Messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot(_val => {
          let allMsg = _val.docs.map(_data => {
            return _data.data();
          });
          setMessages(allMsg);
        });
    } catch (e) {}
  }, [props.route.params.id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    props.route.params.members.map(async item => {
      await firestore()
        .collection('users')
        .doc(item)
        .get()
        .then(__val => {
          let Lists = [];
          let {token} = __val.data();
          Lists.push(token);
          setUserForToken(Lists);
        });
    });
  }, [props.route.params.members]);

  let pickImage = () => {
    ImageCropPicker.openPicker({
      width: 720,
      height: 1080,
      cropping: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      includeBase64: true,
    }).then(_image => {
      console.log(`data:image/jpeg;base64,${_image.data}`);
      setImageUri(`data:image/jpeg;base64,${_image.data}`);
    });
  };

  let sendMessage = () => {
    try {
      firestore()
        .collection('groups')
        .doc(props.route.params.id)
        .collection('Messages')
        .add({
          createdAt: Date.now(),
          messageText,
          image: imageUri ? imageUri : null,
          uid: auth().currentUser.uid,
        })
        .then(() => sendPushNotification());
      setMessageText('');
      setImageUri(null);
    } catch (e) {}
  };

  const sendPushNotification = async () => {
    const FIREBASE_API_KEY =
      'AAAAjqJY0zI:APA91bFf3LXAnyDmGHgTUNKhjVoKzEpbjDeRkOQOXqDs3OB2j2FEYZduHluuyqdD0Ul9qtCPMcB9Cc3uAClcwjR6RK0gZFuF2YVpOAmvSsWIlAecIENsh92oXpCuvqiqG6z2vdouGqah';
    const message = {
      registration_ids: userForToken,
      // notification: {
      //   vibrate: 1,
      //   sound: 1,
      //   show_in_foreground: true,
      //   priority: 'high',
      //   title: props.route.params.headerTitle,
      //   icon: props.route.params.item.groupImage,
      //   content_available: true,
      // },
      data: {
        type: 'MEASURE_CHANGE',
        custom_notification: {
          body: 'test body',
          title: 'test title',
          color: '#00ACD4',
          priority: 'high',
          icon: 'ic_notif',
          group: 'GROUP',
          id: 'id',
          show_in_foreground: true,
        },
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    response = await response.json();
    console.log(response);
  };

  let flatlistRef = useRef();

  return (
    <>
      <View
        style={{
          padding: 8,
          backgroundColor: '#FFF',
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
        }}>
        <AntDesign
          onPress={() => props.navigation.goBack()}
          name="arrowleft"
          style={{marginHorizontal: 8}}
          size={24}
          color="black"
        />
        <Image
          source={{uri: props.route.params.item.groupImage}}
          style={{width: 36, marginRight: 8, borderRadius: 80, height: 36}}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            props.navigation.navigate('photogram.chatDetails.screen', {
              item: props.route.params.item,
              route: props.route,
            })
          }>
          <Text style={{fontFamily: 'Lato-Bold'}}>
            {props.route.params.headerTitle}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
            }}>{`${props.route.params.item.members.length} members`}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        style={{justifyContent: 'center', display: 'flex'}}
        visible={imageUri ? true : false}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Ionicons
            onPress={() => {
              setImageUri(null);
              setMessageText('');
            }}
            style={{top: 3, left: 3, position: 'absolute'}}
            name="close"
            size={24}
            color="black"
          />
          <Image source={{uri: imageUri}} style={{height: height / 3, width}} />
          <TextInput
            placeholderTextColor="#000"
            style={{color: '#000', fontFamily: 'Lato-Regular'}}
            width={width}
            placeholder="Type the message here ....."
            onChangeText={_val => setMessageText(_val)}
          />
          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 8}}
            onPress={sendMessage}
            disabled={
              messageText.replace(/\s/g, '').length === 0 ? true : false
            }>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 18,
                color: '#45A4FF',
              }}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flexDirection: 'column-reverse'}}>
        <FlatList
          enableEmptySections={true}
          scrollEnabled={true}
          inverted={false}
          scrollEventThrottle={100}
          ref={flatlistRef}
          style={{
            marginBottom: 12,
            flex: 1,
            bottom: 0,
            flexDirection: 'column-reverse',
          }}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatlistRef.current.scrollToEnd({animated: false})
          }
          data={messages}
          renderItem={({item}) => {
            return <MessageCard navigation={props.navigation} item={item} />;
          }}
        />
      </ScrollView>
      <View
        style={{
          backgroundColor: '#FFF',
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          width: width,
        }}>
        <Ionicons
          onPress={pickImage}
          style={{marginHorizontal: 6}}
          name="images"
          size={24}
          color="black"
        />

        <TextInput
          placeholderTextColor="#000"
          value={messageText}
          onChangeText={_message_text => setMessageText(_message_text)}
          placeholder={'Type the message here ......'}
          style={{
            padding: 12,
            color: '#000',
            width: '82%',
            fontFamily: 'Lato-Regular',
            backgroundColor: '#FFF',
            bottom: 0,
            zIndex: 100,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          disabled={messageText.replace(/\s/g, '').length === 0 ? true : false}>
          <Text style={{fontFamily: 'Lato-Regular', color: '#45A4FF'}}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
