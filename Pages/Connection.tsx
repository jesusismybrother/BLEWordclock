import {Text, View, Button, TouchableOpacity} from 'react-native';

import React, {useState, useContext} from 'react';

import {Divider} from 'react-native-elements';

import RNPickerSelect from 'react-native-picker-select';

import {styles} from '../Styles/styles';

import {ConnectionContext, BLTparameters} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Connection() {
  const BLToptions = useContext(BLTparameters);
  const connectionContext = useContext(ConnectionContext);

  const [selectedBT, setSelectedBT] = useState('none');
  const [WifiList, setWifiList] = useState([
    {label: 'Wifi1', value: 'Wifi1'},
    {label: 'Wifi2', value: 'Wifi2'},
    {label: 'Wifi3', value: 'Wifi3'},
    {label: 'Wifi4', value: 'Wifi4'},
  ]);

  return (
    <View>
      <ConnectionIndicator />

      <Divider width={2} />

      <View style={styles.rowView}>
        <Text style={styles.titleText}>Bluetooth</Text>
      </View>

      <View style={styles.rowView}>
        <Button title="Search" onPress={() => BLToptions.scanDevices()} />

        <TouchableOpacity style={{width: 120}}>
          {BLToptions.isConnected ? (
            <Button
              title="Disconnect"
              onPress={() => {
                const item = BLToptions.foundDevices.find(
                  dev => dev.value === selectedBT,
                );
                BLToptions.disconnectDevice(item.device);
              }}
            />
          ) : (
            <Button
              title="Connect"
              onPress={() => {
                const item = BLToptions.foundDevices.find(
                  dev => dev.value === selectedBT,
                );
                if (item != null) {
                  BLToptions.connectDevice(item.device);
                }
              }}
              disabled={connectionContext.isConnectedWIFI == true}
            />
          )}
        </TouchableOpacity>
      </View>

      <RNPickerSelect
        onValueChange={value => {
          setSelectedBT(value);
        }}
        items={BLToptions.foundDevices}
      />

      <Divider width={2} />
      <View style={styles.rowView}>
        <Text style={styles.titleText}>Wifi</Text>
      </View>

      <View style={styles.rowView}>
        <Button title="Search" onPress={() => console.log('Search Wifi')} />
        <TouchableOpacity style={{width: 120}}>
          {connectionContext.isConnectedWIFI ? (
            <Button
              title="Disconnect"
              onPress={() => {
                connectionContext.setWifiFalse();
              }}
            />
          ) : (
            <Button
              title="Connect"
              onPress={() => {
                connectionContext.setWifiTrue();
              }}
              disabled={connectionContext.isConnectedBT == true}
            />
          )}
        </TouchableOpacity>
      </View>
      <RNPickerSelect
        onValueChange={value => console.log(value)}
        items={WifiList}
      />
      <Divider width={2} />
    </View>
  );
}
