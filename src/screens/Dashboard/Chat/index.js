import React, {useEffect, useRef, useState} from 'react';
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
  let [messageText, setMessageText] = useState('');
  let [messages, setMessages] = useState([]);

  let fetchMessages = async () => {
    let Lists = [];
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
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
        });
      setMessageText('');
      setImageUri(null);
    } catch (e) {}
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
          style={{marginHorizontal: 12}}
          size={24}
          color="black"
        />
        <View>
          <Text style={{fontFamily: 'Lato-Bold'}}>
            {props.route.params.headerTitle}
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
            }}>{`${props.route.params.item.members.length} members`}</Text>
        </View>
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
      <ScrollView style={{flexDirection: 'column-reverse'}}>
        <FlatList
          enableEmptySections={true}
          scrollEnabled={true}
          inverted
          scrollEventThrottle={100}
          ref={flatlistRef}
          style={{
            marginBottom: 12,
            flex: 1,
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
