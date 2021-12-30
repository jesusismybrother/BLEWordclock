import React from 'react';
import {BleManager, Device} from 'react-native-ble-plx';

//contains information about BL and Wifi connection
const WordclockData = React.createContext(null);

//Used to interact with the BLT manager

const BLTparameters = React.createContext(null);

export {BLTparameters, WordclockData};
