import {Text, View, Button, StyleSheet} from 'react-native';

import React, {useState} from 'react';

import {styles} from '../Styles/styles';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Colors() {

  return (
    <View>
      <ConnectionIndicator />
    </View>
  );
}
