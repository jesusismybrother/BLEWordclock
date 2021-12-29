import React, {useContext} from 'react';
import {Text, View} from 'react-native';

import {WordclockData, BLTparameters} from '../AppContext/Appcontext';
import {styles} from '../Styles/styles';

export function ConnectionIndicator() {
  const WordclockDataContext = useContext(WordclockData);
  const BLToptions = useContext(BLTparameters);
  return (
    <View style={styles.rowView}>
      <Text> Connection State:</Text>
      {BLToptions.isConnected ? (
        <Text style={{width: 120}}>Connected!</Text>
      ) : (
        <Text style={{width: 120}}>Disconnected!</Text>
      )}
    </View>
  );
}
