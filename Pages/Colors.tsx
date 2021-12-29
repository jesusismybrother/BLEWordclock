import {Text, View, Button, Dimensions, StyleSheet} from 'react-native';
import React, {useState, useContext, Component} from 'react';
import {styles} from '../Styles/styles';
import {Slider} from '@miblanchard/react-native-slider';
import {WordclockData} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

import {TriangleColorPicker, fromHsv} from 'react-native-color-picker';

export function Colors() {
  const [sliderState, setSliderState] = useState(50);
  const WordclockDataContext = useContext(WordclockData);

  return (
    <View>
      <ConnectionIndicator />
      <View style={styles.rowView}>
        <Text style={styles.titleText}>Color</Text>
      </View>

      <View style={styles.rowView}>
        <Text style={styles.baseText && {width: 150}}>Brightness</Text>
        <Text style={styles.baseText}>Value: {sliderState}%</Text>
      </View>

      <Slider
        value={sliderState}
        maximumValue={100}
        minimumValue={0}
        step={5}
        onValueChange={value => setSliderState(value[0])}
        onSlidingComplete={value =>
          WordclockDataContext.setBrightness(value[0])
        }
      />
      <TriangleColorPicker
        onColorSelected={value => {
          WordclockDataContext.setColor(value);
        }}
        hideControls={false}
        style={{
          width: 350,
          height: 300,
        }}
      />
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Select Color</Text>
      </View>
    </View>
  );
}
