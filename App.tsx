import React, {useReducer, useState, useEffect, useCallback} from 'react';
import {TouchableOpacity, Button, PermissionsAndroid, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import base64 from 'react-native-base64';
import {WordclockData, BLTparameters} from './AppContext/Appcontext';

import {BleManager, Device} from 'react-native-ble-plx';

import MyTabs from './Components/Tabs';
import WelcomePage from './Pages/WelcomePage';
import Spinner from 'react-native-loading-spinner-overlay';

import Toast from 'react-native-simple-toast';

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
const WIFI_SERVICE_UUID = 'f7c75cd0-2082-4fd1-8d7d-94523bc32688';

const MESSAGE_CHARACTERISTIC_UUID = '7cb38031-e0ae-4fa3-b365-df54564b33bc';
const WIFICONNECTED_CHARACTERISTIC_UUID =
  '9822a39c-066f-4c24-888b-7b825be94ec2';
const SSID_CHARACTERISTIC_UUID = 'b16da357-b7bf-4825-b2cd-25790570af6f';
const PASSWORD_CHARACTERISTIC_UUID = 'f16b1d63-b8d7-4531-94a7-551102fe5a8a';

const NIGHTMODE_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const SUMMERTIME_CHARACTERISTIC_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';
const TIMEZONE_CHARACTERISTIC_UUID = 'f27b53ad-c63d-49a0-8c0f-9f297e6cc520';
const HEARTBEAT_CHARACTERISTIC_UUID = '90853600-1dbb-4e78-9510-ec7a5762bed5';

const NIGHTMODEFROM_CHARACTERISTIC_UUID =
  '135765a3-58f9-401c-86e4-aa290444a7df';
const NIGHTMODETO_CHARACTERISTIC_UUID = '8ee0395f-8cf1-4599-88b7-265b5eec79d0';
const NIGHTMODEBRIGHT_CHARACTERISTIC_UUID =
  'a10d6655-a7ab-41d5-b61b-05631d147fad';

const COLOR_CHARACTERISTIC_UUID = '63311740-35c8-4f20-9453-51c12f4bba04';
const BRIGHTNETT_CHARACTERISTIC_UUID = '5b1d822c-20ac-4286-a1ac-dd991d6b3e8f';

const HEARTBEAT_INTERVAL = 1000;

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

  const [wifiConnected, setWifiConnected] = useState(false);
  const [ssid, setSsid] = useState('');
  const [message, setMessage] = useState('');

  const [nightmodeFrom, setNightmodeFrom] = useState('22:00');
  const [nightmodeTo, setNightmodeTo] = useState('05:00');

  const [color, setColor] = useState('#ff0000');
  const [brightness, setBrightness] = useState(50);

  const [dateFrom, setDateFrom] = useState(new Date(1598051730000));
  const [dateTo, setDateTo] = useState(new Date(1598051730000));

  var heartbeatTimeout: NodeJS.Timeout;

  // BLT Connections
  const BLTfunctions = {
    scanDevices,
    connectDevice,
    disconnectDevice,
    foundDevices: scannedDevices,
    isLoading: isLoading,
    isConnected: isConnected,
  };

  // Scans availbale BLT Devices and adds them to the list "scannedDevices"
  async function scanDevices() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
      .then(answere => {
        console.log('scanning');
        Toast.show('Scanning');
        // display the Activityindicator
        setIsLoading(true);
        let found = false;

        BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (error) {
            console.warn(error);
          }

          // if a device is detected add the device to the list by dispatching the action into the reducer
          // if (scannedDevice && scannedDevice.name != null) {
          //   console.log(scannedDevice.name);
          //   dispatch({
          //     type: 'ADD_DEVICE',
          //     payload: {
          //       device: scannedDevice,
          //       label: scannedDevice.name,
          //       value: scannedDevice.id,
          //     },
          //   });
          // }

          if (scannedDevice && scannedDevice.name == 'WordclockBLE') {
            BLTManager.stopDeviceScan();
            found = true;
            connectDevice(scannedDevice);
          }
        });

        // stop scanning devices after 5 seconds
        setTimeout(() => {
          BLTManager.stopDeviceScan();
          setIsLoading(false);
          if (found == false) {
            Toast.show('Word clock not found');
          }
        }, 5000);
      })
      .catch();
  }

  //Connect the device and start monitoring characteristics
  async function connectDevice(device: Device) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permission Localisation Bluetooth',
        message: 'Requirement for Bluetooth',
        buttonNeutral: 'Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(granted);

    setIsLoading(true);
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setIsConnected(true);

        return device.discoverAllServicesAndCharacteristics();
      })
      .catch()
      .then(device => {
        //Set what happenes on a DC
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          clearTimeout(heartbeatTimeout);
          setIsConnected(false);
        });

        // Setup the Hearbeat to the ESP
        heartbeatTimeout = setInterval(() => {
          console.log('Sending heartbeat');
          BLTManager.writeCharacteristicWithResponseForDevice(
            connectedDevice?.id,
            SERVICE_UUID,
            HEARTBEAT_CHARACTERISTIC_UUID,
            base64.encode('heartbeat'),
          )
            .then()
            .catch(error => {
              console.log(error);
            });
        }, HEARTBEAT_INTERVAL);

        //Read inital values

        //Summertime
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            SUMMERTIME_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setSummertime(StringToBool(base64.decode(valenc?.value)));
          })
          .catch();

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
          })
          .catch();

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
          })
          .catch();

        //Timezone
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            TIMEZONE_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setTimeZone(base64.decode(valenc?.value));
          })
          .catch();

        //Brightness
        device
          .readCharacteristicForService(
            SERVICE_UUID,
            BRIGHTNETT_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setBrightness(parseInt(base64.decode(valenc?.value)));
          })
          .catch();

        //Color
        device
          .readCharacteristicForService(SERVICE_UUID, COLOR_CHARACTERISTIC_UUID)
          .then(valenc => {
            setColor(base64.decode(valenc?.value));
          })
          .catch();

        //WifiConnected
        device
          .readCharacteristicForService(
            WIFI_SERVICE_UUID,
            WIFICONNECTED_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setWifiConnected(StringToBool(base64.decode(valenc?.value)));
          })
          .catch();

        //SSID
        device
          .readCharacteristicForService(
            WIFI_SERVICE_UUID,
            SSID_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setSsid(base64.decode(valenc?.value));
          })
          .catch();

        //Message
        device
          .readCharacteristicForService(
            WIFI_SERVICE_UUID,
            MESSAGE_CHARACTERISTIC_UUID,
          )
          .then(valenc => {
            setMessage(base64.decode(valenc?.value));
          })
          .catch();

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

        //WifiIsConnected
        device.monitorCharacteristicForService(
          WIFI_SERVICE_UUID,
          WIFICONNECTED_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setWifiConnected(
                StringToBool(base64.decode(characteristic?.value)),
              );
              console.log(
                'WifiisConnected update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'wifiisconnectedtransaction',
        );

        //SSid
        device.monitorCharacteristicForService(
          WIFI_SERVICE_UUID,
          SSID_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setSsid(base64.decode(characteristic?.value));
              console.log(
                'SSID received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'ssidtransaction',
        );

        //Message
        device.monitorCharacteristicForService(
          WIFI_SERVICE_UUID,
          MESSAGE_CHARACTERISTIC_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              console.log(
                'Message received: ',
                base64.decode(characteristic?.value),
              );
              Toast.show(base64.decode(characteristic?.value));
            }
          },
          'messagetransaction',
        );
      })
      .catch(error => {
        console.log('Could not connect');
        Toast.show('Connection failed');
      });

    setIsLoading(false);
    console.log('Connection established');

    Toast.show('Connection established');
  }

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
        BLTManager.cancelTransaction('wifisconnectedtransaction');
        BLTManager.cancelTransaction('messagetransaction');
        BLTManager.cancelTransaction('ssidtransaction');
        clearTimeout(heartbeatTimeout);
        BLTManager.cancelDeviceConnection(connectedDevice.id)
          .then(() => {
            console.log('DC completed');
            Toast.show('Disconnected');
          })
          .catch();
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setIsConnected(false);
      }
    }
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

    ssid: ssid,
    message: message,
    isConnected: wifiConnected,

    setPassword: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        WIFI_SERVICE_UUID,
        PASSWORD_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log(
            'Password changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setSsid: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        WIFI_SERVICE_UUID,
        SSID_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log('SSID changed to :', base64.decode(characteristic.value));
        })
        .catch();
    },

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
      )
        .then(characteristic => {
          console.log(
            'Nightmode changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setNightmodebright: (value: number) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODEBRIGHT_CHARACTERISTIC_UUID,
        base64.encode(value.toString()),
      )
        .then(characteristic => {
          console.log(
            'Nightmodebrightness changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setNightmodeFrom: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODEFROM_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log(
            'NightmodeFrom changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setNightmodeTo: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        NIGHT_SERVICE_UUID,
        NIGHTMODETO_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log(
            'NightmodeTo changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setSummertime: (value: boolean) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        SUMMERTIME_CHARACTERISTIC_UUID,
        base64.encode(BoolToString(value)),
      )
        .then(characteristic => {
          console.log(
            'Summertime changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setTimezone: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        TIMEZONE_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log(
            'Timezone changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setBrightness: (value: number) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        BRIGHTNETT_CHARACTERISTIC_UUID,
        base64.encode(value.toString()),
      )
        .then(characteristic => {
          console.log(
            'Brightness changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },

    setColor: (value: string) => {
      BLTManager.writeCharacteristicWithResponseForDevice(
        connectedDevice?.id,
        SERVICE_UUID,
        COLOR_CHARACTERISTIC_UUID,
        base64.encode(value),
      )
        .then(characteristic => {
          console.log(
            'Brightness changed to :',
            base64.decode(characteristic.value),
          );
        })
        .catch();
    },
  };

  return (
    <BLTparameters.Provider value={BLTfunctions}>
      <WordclockData.Provider value={WordclockDataOut}>
        {!isConnected ? (
          <View>
            <Spinner visible={isLoading} />
            <WelcomePage />
          </View>
        ) : (
          <NavigationContainer>
            <MyTabs />
          </NavigationContainer>
        )}
      </WordclockData.Provider>
    </BLTparameters.Provider>
  );
}
