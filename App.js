import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {DrawerContent} from './src/components';
import {AuthProvider} from './src/context/AuthProvider';
import {
  CreateRoom as CreateScreen,
  JoinRoom as JoinScreen,
  Launch,
  Loading,
  Login,
  Profile,
  Register,
  Search,
  Settings,
  Support,
} from './src/screens';

export default function App() {
  let Stack = createNativeStackNavigator();
  let MainDrawerStack = createDrawerNavigator();

  let DashBoard = () => {
    return (
      <MainDrawerStack.Navigator
        drawerContent={props => <DrawerContent {...props} />}>
        <MainDrawerStack.Screen
          name="photogram.launch.screen"
          options={{title: 'Wiggle', headerLeft: null, headerShown: true}}
          component={Launch}
        />
        <MainDrawerStack.Screen
          name="photogram.search.screen"
          options={{title: 'Photogram'}}
          component={Search}
        />
        <MainDrawerStack.Screen
          options={{headerShown: false, title: 'Photogram'}}
          name="photogram.profile.screen"
          component={Profile}
        />
        <MainDrawerStack.Screen
          options={{headerShown: false, title: 'Photogram'}}
          name="photogram.settings.screen"
          component={Settings}
        />
        <MainDrawerStack.Screen
          options={{headerShown: false, title: 'Photogram'}}
          name="photogram.support.screen"
          component={Support}
        />
      </MainDrawerStack.Navigator>
    );
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.loading.screen"
            component={Loading}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.login.screen"
            component={Login}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="photogram.register.screen"
            component={Register}
          />
          <Stack.Screen
            options={{headerShown: false, title: 'Photogram'}}
            name="photogram.dashboard.screen"
            component={DashBoard}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              title: 'Join Room',
              headerTitleAlign: 'center',
              headerLeft: null,
            }}
            name="photogram.join.screen"
            component={JoinScreen}
          />
          <Stack.Screen
            options={{
              headerShown: true,
              title: 'Create Room',
              headerTitleAlign: 'center',
            }}
            name="photogram.create.screen"
            component={CreateScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
