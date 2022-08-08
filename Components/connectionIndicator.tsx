import React, {useContext, useEffect} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';

import {WordclockData, BLTparameters} from '../AppContext/Appcontext';

import {styles} from '../Styles/styles';

export function ConnectionIndicator() {
  const BLToptions = useContext(BLTparameters);
  const WordclockDataContext = useContext(WordclockData);



  return (
    <View style={styles.rowView}>
      {!WordclockDataContext.isConnected ? (
        <Text style={{fontSize: 20}}> Disonnected </Text>
      ) : (
        <Text style={{fontSize: 20}}> Connected </Text>
      )}

      <TouchableOpacity style={{width: 120, height: 40}}>
        {!WordclockDataContext.isConnected ? (
          <Button
            title="Connect"
            onPress={() => {
              BLToptions.scanDevices();
            }}></Button>
        ) : (
          <Button
            title="Disconnect"
            onPress={() => {
              BLToptions.disconnectDevice();
            }}></Button>
        )}
      </TouchableOpacity>
    </View>
  );
}
