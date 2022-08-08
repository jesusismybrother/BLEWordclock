import React , {useState, useEffect, useCallback} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';

//contains information about BL and Wifi connection
const WordclockData = React.createContext({isConnected:false});

//Used to interact with the BLT manager

const BLTparameters = React.createContext(null);


  export {BLTparameters, WordclockData};