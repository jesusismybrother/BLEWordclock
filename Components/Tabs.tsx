import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Settings} from '../Pages/Settings';
import {Connection} from '../Pages/Connection';
import {Colors} from '../Pages/Colors';
import {BLTparameters} from '../AppContext/Appcontext';
const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Connection') {
            iconName = focused ? 'wifi' : 'wifi-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Colors') {
            iconName = focused ? 'color-palette' : 'color-palette-outline';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: 'true',
      })}>
      <Tab.Screen name="Connection" component={Connection} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Colors" component={Colors} />
    </Tab.Navigator>
  );
}
