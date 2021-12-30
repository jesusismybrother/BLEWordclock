import {Text, View, Button, Dimensions, StyleSheet} from 'react-native';
import React, {useState, useContext, useEffect, Component} from 'react';
import {styles} from '../Styles/styles';
import {Slider} from '@miblanchard/react-native-slider';
import {WordclockData} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

import {TriangleColorPicker, fromHsv, toHsv} from 'react-native-color-picker';

export function Colors() {
  const [sliderState, setSliderState] = useState(50);
  const [color, setColor] = useState('#ffffff');
  const WordclockDataContext = useContext(WordclockData);

  useEffect(() => {
    setSliderState(WordclockDataContext.brightness);
    setColor(WordclockDataContext.color);
  }, []);

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
        onColorChange={value => {
          setColor(fromHsv(value));
        }}
        color={toHsv(color)}
      />
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Select Color</Text>
      </View>
    </View>
  );
}
