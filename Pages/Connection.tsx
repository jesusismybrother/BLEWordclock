import {
  Text,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Button,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';

import React, {useState, useContext} from 'react';

import {Divider} from 'react-native-elements';

import RNPickerSelect from 'react-native-picker-select';

import {styles} from '../Styles/styles';

import {WordclockData, BLTparameters} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Connection() {
  const BLToptions = useContext(BLTparameters);
  const WordclockDataContext = useContext(WordclockData);

  const [selectedBT, setSelectedBT] = useState('none');

  const [text, onChangeText] = React.useState('Useless Text');

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
                BLToptions.disconnectDevice();
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
              disabled={false}
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
        <Text>SSID:</Text>
        <TextInput onChangeText={onChangeText} placeholder="Wifi" />
      </View>
      <View style={styles.rowView}>
        <Text>Password:</Text>

        <TextInput
          onChangeText={onChangeText}
          secureTextEntry={true}
          placeholder="Password"
        />
      </View>
      <View style={styles.rowView}>
        <TouchableOpacity style={{width: 220}}>
          <Button
            title="Set Wifi Connection"
            onPress={() => {
              // connectionContext.setWifiFalse();
            }}
          />
        </TouchableOpacity>
      </View>
      {/* <Divider width={2} /> */}
    </View>
  );
}
