import React, {useReducer, useState, useEffect, useCallback} from 'react';
import {PermissionsAndroid} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import base64 from 'react-native-base64';
import {WordclockData, BLTparameters} from './AppContext/Appcontext';

import {BleManager, Device} from 'react-native-ble-plx';

import MyTabs from './Components/Tabs';
import Spinner from 'react-native-loading-spinner-overlay';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();

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

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const NIGHT_SERVICE_UUID = '0d8518ba-ed68-4583-a85e-6352b7bba0bc';

const NIGHTMODE_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const SUMMERTIME_CHARACTERISTIC_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';
const TIMEZONE_CHARACTERISTIC_UUID = 'f27b53ad-c63d-49a0-8c0f-9f297e6cc520';
const NIGHTMODEFROM_CHARACTERISTIC_UUID =
  '135765a3-58f9-401c-86e4-aa290444a7df';
const NIGHTMODETO_CHARACTERISTIC_UUID = '8ee0395f-8cf1-4599-88b7-265b5eec79d0';
const NIGHTMODEBRIGHT_CHARACTERISTIC_UUID =
  'a10d6655-a7ab-41d5-b61b-05631d147fad';

const COLOR_CHARACTERISTIC_UUID = '63311740-35c8-4f20-9453-51c12f4bba04';
const BRIGHTNETT_CHARACTERISTIC_UUID = '5b1d822c-20ac-4286-a1ac-dd991d6b3e8f';

const DC_CHECK_INTERVAL = 2000;

function StringToBool(input: String) {
  if (input == '1') {
    return true;
  } else {
    return false;
  }
}

function BoolToString(input: boolean) {
  if (input == true) {
    return '1';
  } else {
    return '0';
  }
}

export default function App() {
  //Used to check if BLT Device has Disconnected periodically

  const [scannedDevices, dispatch] = useReducer(reducer, []);

  // state to give the user a feedback about the manager scanning devices
  const [isLoading, setIsLoading] = useState(false);

  //Is a device connected?
  const [isConnected, setIsConnected] = useState(false);

  //What device is connected?
  const [connectedDevice, setConnectedDevice] = useState<Device>();

  // Wordclock parameters
  const [summertime, setSummertime] = useState(false);

  const [timezone, setTimeZone] = useState('0');
  const [nightmode, setNightmode] = useState(true);
  const [nightmodebright, setNightmodebright] = useState(20);

  const [nightmodeFrom, setNightmodeFrom] = useState('22:00');
  const [nightmodeTo, setNightmodeTo] = useState('05:00');

  const [arduinoTest, setArduinoTest] = useState('0');

  const [color, setColor] = useState('#ff0000');
  const [brightness, setBrightness] = useState(50);

  const [dateFrom, setDateFrom] = useState(new Date(1598051730000));
  const [dateTo, setDateTo] = useState(new Date(1598051730000));

  // Scans availbale BLT Devices and adds them to the list "scannedDevices"
  const scanDevices = () => {
    console.log('scanning');
    // display the Activityindicator
    setIsLoading(true);

    BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
      }

      // if a device is detected add the device to the list by dispatching the action into the reducer
      if (scannedDevice && scannedDevice.name != null) {
        console.log(scannedDevice.name);
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

  // BLT Connections
  const BLTfunctions = {
    scanDevices,
    connectDevice,
    disconnectDevice,
    foundDevices: scannedDevices,
    arduinoValue: arduinoTest,
    isLoading: isLoading,
    isConnected: isConnected,
  };

  // handle the device disconnection (poorly)
  async function disconnectDevice() {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        // nightmodepromise?.remove();
        // summertimepromise?.remove();
        // timezonepromise?.remove();
        BLTManager.cancelTransaction('summertimetransaction');
        BLTManager.cancelTransaction('nightmodetransaction');
        BLTManager.cancelTransaction('nightmodebrighttransaction');
        BLTManager.cancelTransaction('nightmodefromtransaction');
        BLTManager.cancelTransaction('nightmodetotransaction');
        BLTManager.cancelTransaction('timezonetransaction');
        BLTManager.cancelTransaction('brightnesstransaction');
        BLTManager.cancelTransaction('colortransaction');

        BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>
          console.log('DC completed'),
        );
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setIsConnected(false);
      }
    }
  }

  //Connect the device and start monitoring characteristics
  async function connectDevice(device: Device) {
    setIsLoading(true);
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //Read inital values
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });
        //Summertime
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            SUMMERTIME_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setSummertime(StringToBool(base64.decode(valenc?.value)));
          });

        //Nightmode
        device
          .readCharacteristicForService(
            NIGHT_SERVICE_UUID,
            NIGHTMODE_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setNightmode(StringToBool(base64.decode(valenc?.value)));
          });

        //Nightmodebrightness
        device
          .readCharacteristicForService(
            NIGHT_SERVICE_UUID,
            NIGHTMODEBRIGHT_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setNightmodebright(parseInt(base64.decode(valenc?.value)));
          });

        //NightmodeFrom
        device
          .readCharacteristicForService(
            NIGHT_SERVICE_UUID,
            NIGHTMODEFROM_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            let values = base64.decode(valenc?.value).split(':');
            if (parseInt(values[0]) < 10) {
              values[0] = '0' + values[0];
            }
            if (parseInt(values[1]) < 10) {
              values[1] = '0' + values[1];
            }
            setNightmodeFrom(values[0] + ':' + values[1]);
            // setDateFrom(
            //   new Date('2016-01-04 ' + values[0] + ':' + values[1] + ':23'),
            // );
          });

        //NightmodeTo
        device
          .readCharacteristicForService(
            NIGHT_SERVICE_UUID,
            NIGHTMODETO_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            let values = base64.decode(valenc?.value).split(':');

            if (parseInt(values[0]) < 10) {
              values[0] = '0' + values[0];
            }
            if (parseInt(values[1]) < 10) {
              values[1] = '0' + values[1];
            }
            setNightmodeTo(values[0] + ':' + values[1]);
            // const fulldate =
            //   '2016-01-04 ' + values[0] + ':' + values[1] + ':23';
            // setDateTo(new Date(fulldate));
          });

        //Timezone
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            TIMEZONE_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setTimeZone(base64.decode(valenc?.value));
          });

        //Brightness
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            BRIGHTNETT_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setBrightness(parseInt(base64.decode(valenc?.value)));
          });

        //Color
        device
          .readCharacteristicForService(SERVICE_UUID, COLOR_CHARACTERISTIC_UUID)
          .then(valenc => {
            setColor(base64.decode(valenc?.value));
          });

        //monitor values

        //Summertime
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          SUMMERTIME_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              console.log(error);
              setSummertime(StringToBool(base64.decode(characteristic?.value)));
              console.log(
                'Summertime update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'summertimetransaction',
        );

        //Nightmode
        device.monitorCharacteristicForService(
          NIGHT_SERVICE_UUID,
          NIGHTMODE_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setNightmode(StringToBool(base64.decode(characteristic?.value)));
              console.log(
                'Nightmode update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'nightmodetransaction',
        );

        //Nightmodebrightness
        device.monitorCharacteristicForService(
          NIGHT_SERVICE_UUID,
          NIGHTMODEBRIGHT_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setNightmodebright(
                parseInt(base64.decode(characteristic?.value)),
              );
              console.log(
                'Nightmodebrightness update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'nightmodebrighttransaction',
        );

        //NightmodeFrom
        device.monitorCharacteristicForService(
          NIGHT_SERVICE_UUID,
          NIGHTMODEFROM_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              let values = base64.decode(characteristic?.value).split(':');

              if (parseInt(values[0]) < 10) {
                values[0] = '0' + values[0];
              }
              if (parseInt(values[1]) < 10) {
                values[1] = '0' + values[1];
              }
              setNightmodeFrom(values[0] + ':' + values[1]);
              // setDateFrom(
              //   new Date('2016-01-04 ' + values[0] + ':' + values[1] + ':23'),
              // );

              console.log(
                'NightmodeFrom update received: ',
                values[0] + ':' + values[1],
              );
            }
          },
          'nightmodefromtransaction',
        );

        //NightmodeTo
        device.monitorCharacteristicForService(
          NIGHT_SERVICE_UUID,
          NIGHTMODETO_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              let values = base64.decode(characteristic?.value).split(':');

              if (parseInt(values[0]) < 10) {
                values[0] = '0' + values[0];
              }
              if (parseInt(values[1]) < 10) {
                values[1] = '0' + values[1];
              }
              setNightmodeTo(values[0] + ':' + values[1]);
              // setDateTo(
              //   new Date('2016-01-04 ' + values[0] + ':' + values[1] + ':23'),
              // );
              console.log(
                'NightmodeTo update received: ',
                values[0] + ':' + values[1],
              );
            }
          },
          'nightmodetotransaction',
        );

        //Timezone
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          TIMEZONE_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setTimeZone(base64.decode(characteristic?.value));
              console.log(
                'Timezone update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'timezonetransaction',
        );

        //Color
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          COLOR_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setColor(base64.decode(characteristic?.value));
              console.log(
                'Color update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'colortransaction',
        );

        //Brightness
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          BRIGHTNETT_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setBrightness(parseInt(base64.decode(characteristic?.value)));
              console.log(
                'Brightness update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'brightnesstransaction',
        );
      });

    setIsLoading(false);
    console.log('Connection established');
  }

  // Wordclock data

  const WordclockDataOut = {
    summertime: summertime,

    nightmode: nightmode,
    nightmodebrightness: nightmodebright,
    nightmodeFrom: nightmodeFrom,
    nightmodeTo: nightmodeTo,

    timezone: timezone,

    color: color,
    brightness: brightness,

    dateFrom: dateFrom,
    dateTo: dateTo,

    setDateFrom: (value: Date) => {
      setDateFrom(value);
    },

    setDateTo: (value: Date) => {
      setDateTo(value);
    },

    setNightmode: (value: boolean) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODE_CHARACTERISTIC_UUID,
        base64.encode(BoolToString(value)),
      ).then(characteristic => {
        console.log(
          'Nightmode changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setNightmodebright: (value: number) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODEBRIGHT_CHARACTERISTIC_UUID,
        base64.encode(value.toString()),
      ).then(characteristic => {
        console.log(
          'Nightmodebrightness changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setNightmodeFrom: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODEFROM_CHARACTERISTIC_UUID,
        base64.encode(value),
      ).then(characteristic => {
        console.log(
          'NightmodeFrom changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setNightmodeTo: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODETO_CHARACTERISTIC_UUID,
        base64.encode(value),
      ).then(characteristic => {
        console.log(
          'NightmodeTo changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setSummertime: (value: boolean) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        SUMMERTIME_CHARACTERISTIC_UUID,
        base64.encode(BoolToString(value)),
      ).then(characteristic => {
        console.log(
          'Summertime changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setTimezone: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        TIMEZONE_CHARACTERISTIC_UUID,
        base64.encode(value),
      ).then(characteristic => {
        console.log(
          'Timezone changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setBrightness: (value: number) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        BRIGHTNETT_CHARACTERISTIC_UUID,
        base64.encode(value.toString()),
      ).then(characteristic => {
        console.log(
          'Brightness changed to :',
          base64.decode(characteristic.value),
        );
      });
    },

    setColor: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        COLOR_CHARACTERISTIC_UUID,
        base64.encode(value),
      ).then(characteristic => {
        console.log(
          'Brightness changed to :',
          base64.decode(characteristic.value),
        );
      });
    },
  };

  return (
    <BLTparameters.Provider value={BLTfunctions}>
      <WordclockData.Provider value={WordclockDataOut}>
        <NavigationContainer>
          <Spinner visible={isLoading} textContent={'Searching...'} />
          <MyTabs />
        </NavigationContainer>
      </WordclockData.Provider>
    </BLTparameters.Provider>
  );
}
