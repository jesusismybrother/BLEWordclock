import React, {useContext} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';

import {WordclockData, BLTparameters} from '../AppContext/Appcontext';
import {styles} from '../Styles/styles';

export function ConnectionIndicator() {
  const BLToptions = useContext(BLTparameters);
  return (
    <View style={styles.rowView}>
      <Text style={{fontSize: 20}}> Connected! </Text>
      <TouchableOpacity style={{width: 120, height: 40}}>
        <Button
          title="Disconnect"
          onPress={() => {
            BLToptions.disconnectDevice();
          }}></Button>
      </TouchableOpacity>
    </View>
  );
}
