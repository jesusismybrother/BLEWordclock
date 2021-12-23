import React, {useReducer, useState, useEffect, useCallback} from 'react';
import {PermissionsAndroid,} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import {Settings} from './Pages/Settings';
import {Connection} from './Pages/Connection';
import {Colors} from './Pages/Colors';

import {ConnectionContext, BLTparameters} from './AppContext/Appcontext';

import {BleManager, Device, Service} from 'react-native-ble-plx';

import Spinner from 'react-native-loading-spinner-overlay';

const BLTManager = new BleManager();

const Tab = createBottomTabNavigator();

function MyTabs() {
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
      })}>
      <Tab.Screen name="Connection" component={Connection} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Colors" component={Colors} />
    </Tab.Navigator>
  );
}

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
        title: 'Location permission for bluetooth scanning',
        message: 'wahtever',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ); 
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const reducer = (
  state: any[],
  action:
    | {
        type: 'ADD_DEVICE';
        payload: {device: Device; label: string; value: string};
      }
    | {type: 'CLEAR'},
) => {
  switch (action.type) {
    case 'ADD_DEVICE':
      const {payload: founddevice} = action;

      // check if the detected device is not already added to the list
      if (
        founddevice.device &&
        !state.find(dev => dev.value === action.payload.value)
      ) {
        return [
          ...state,
          {
            device: action.payload.device,
            label: action.payload.label,
            value: action.payload.value,
          },
        ];
      }
      return state;
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};



export default function App() {
  const [scannedDevices, dispatch] = useReducer(reducer, []);

  // state to give the user a feedback about the manager scanning devices
  const [isLoading, setIsLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const scanDevices = () => {
    // display the Activityindicator
    setIsLoading(true);
    // dispatch({type: 'CLEAR'});
    // scan devices

    BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
      }

      // if a device is detected add the device to the list by dispatching the action into the reducer
      if (scannedDevice && scannedDevice.name != null) {
        dispatch({
          type: 'ADD_DEVICE',
          payload: {
            device: scannedDevice,
            label: scannedDevice.name,
            value: scannedDevice.id,
          },
        });
      }
    });

    // stop scanning devices after 5 seconds
    setTimeout(() => {
      BLTManager.stopDeviceScan();
      setIsLoading(false);
    }, 5000);
  };

  const BLTfunctions = {
    scanDevices,
    connectDevice,
    disconnectDevice,
    foundDevices: scannedDevices,
    isLoading: isLoading,
    isConnected: isConnected,
  };

  // BLT Connections

  // handle the device disconnection
  async function disconnectDevice(device: Device) {
    console.log('Disconnecting');

    const isDeviceConnected = await device.isConnected();
    if (isDeviceConnected) {
      await device.cancelConnection();
    }
    const connectionStatus = await device.isConnected();
    if (!connectionStatus) {
      setIsConnected(false);
    }
  }

  async function connectDevice(device: Device) {
    const permission = requestLocationPermission();
    console.log('connecting to Device:', device.name);
    const connectedDevice = await device.connect();
    const connectionStatus = await device.isConnected();
    if (connectionStatus) {
      setIsConnected(true);
      const discoveredServices = await allServicesAndCharacteristics.services();
      setServices(discoveredServices);
      console.log(services)
    }
    
  }

  // CONNECTION PARAMETERS
  const [isConnectedBT, setisConnectedBT] = useState(false);
  const [isConnectedWIFI, setisConnectedWIFI] = useState(false);

  const setBTTrue = () => {
    setisConnectedBT(true);
    console.log('SetBTTrue');
  };
  const setBTFalse = () => {
    setisConnectedBT(false);
    console.log('SetBTFalse');
  };
  const setWifiTrue = () => {
    setisConnectedWIFI(true);
    console.log('SetWifiTrue');
  };
  const setWifiFalse = () => {
    setisConnectedWIFI(false);
    console.log('SetWifiFalse');
  };

  const connectionSettings = {
    isConnectedBT: isConnectedBT,
    isConnectedWIFI: isConnectedWIFI,
    setBTTrue,
    setBTFalse,
    setWifiTrue,
    setWifiFalse,
  };

  return (
    <BLTparameters.Provider value={BLTfunctions}>
      <ConnectionContext.Provider value={connectionSettings}>
        <NavigationContainer>
          <Spinner visible={isLoading} textContent={'Searching...'} />
          <MyTabs />
        </NavigationContainer>
      </ConnectionContext.Provider>
    </BLTparameters.Provider>
  );
}
