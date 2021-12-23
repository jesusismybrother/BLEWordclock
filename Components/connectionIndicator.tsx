import React, {useContext} from 'react';
import {Text, View} from 'react-native';

import {ConnectionContext, BLTparameters} from '../AppContext/Appcontext';
import {styles} from '../Styles/styles';

export function ConnectionIndicator() {
  const connectionContext = useContext(ConnectionContext);
  const BLToptions = useContext(BLTparameters);
  return (
    <View style={styles.rowView}>
      <Text> Connection State:</Text>
      {BLToptions.isConnected|| connectionContext.isConnectedWIFI ? (
        <Text style={{width: 120}}>Connected!</Text>
      ) : (
        <Text style={{width: 120}}>Disconnected!</Text>
      )}
    </View>
  );
}
