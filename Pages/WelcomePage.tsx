import {Text, View, Button, TouchableOpacity} from 'react-native';

import React, {useContext} from 'react';

import {styles} from '../Styles/styles';

import {BLTparameters} from '../AppContext/Appcontext';

export default function WelcomePage() {
  const BLToptions = useContext(BLTparameters);

  return (
    <View>
      <View style={{paddingBottom: 100}}></View>
      <View style={styles.rowView}>
        <Text style={{fontSize: 30}}>Welcome</Text>
      </View>
      <View style={{paddingBottom: 50}}></View>
      <View style={styles.rowView}>
        <Text style={{fontSize: 15}}>Press the button</Text>
      </View>
      <View style={styles.rowView}>
        <Text style={{fontSize: 15}}>to connect to your Wordclock</Text>
      </View>
      <View style={{paddingBottom: 100}}></View>
      <View style={styles.rowView}>
        <TouchableOpacity style={{width: 120}}>
          <Button
            title="Connect"
            onPress={() => {
              BLToptions.scanDevices();
            }}
            disabled={false}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
