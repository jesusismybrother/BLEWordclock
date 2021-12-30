import {Text, View, Button, TouchableOpacity, TextInput} from 'react-native';

import React, {useState, useContext} from 'react';

import {Divider} from 'react-native-elements';

import {styles} from '../Styles/styles';

import {WordclockData, BLTparameters} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Connection() {
  const WordclockDataContext = useContext(WordclockData);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <ConnectionIndicator />
      <Divider width={2} />

      <View style={styles.rowView}>
        <Text style={styles.titleText}>Wifi</Text>
      </View>
      <View style={styles.rowView}>
        <Text>Is Wifi connected?:</Text>
        {WordclockDataContext.isConnected ? <Text>Yes</Text> : <Text>No</Text>}
      </View>
      <View style={{paddingBottom: 20}}></View>

      <View style={styles.rowView}>
        <Text>SSID:</Text>
        <TextInput
          onChangeText={setSsid}
          placeholder={WordclockDataContext.ssid}
        />
      </View>
      <View style={styles.rowView}>
        <Text>Password:</Text>

        <TextInput
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
        />
      </View>
      <View style={styles.rowView}>
        <TouchableOpacity style={{width: 220}}>
          <Button
            title="Set Wifi Connection"
            onPress={() => {
              if (ssid != '') {
                WordclockDataContext.setSsid(ssid);
              }

              if (password != '') {
                WordclockDataContext.setPassword(password);
              }
            }}
          />
        </TouchableOpacity>
      </View>
      {/* <Divider width={2} /> */}
    </View>
  );
}
