import {Text, View, Button, Platform, TouchableOpacity} from 'react-native';

import React, {useState, useContext} from 'react';

import {Divider} from 'react-native-elements';

import RNPickerSelect from 'react-native-picker-select';

import CheckBox from '@react-native-community/checkbox';

import {Slider} from '@miblanchard/react-native-slider';

import {styles} from '../Styles/styles';

import DateTimePicker from '@react-native-community/datetimepicker';

import {WordclockData} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Settings() {
  const WordclockDataContext = useContext(WordclockData);

  const [sliderState, setSliderState] = useState(0);

  const [dateFrom, setDateFrom] = useState(new Date(1598051730000));
  const [dateTo, setDateTo] = useState(new Date(1598051730000));

  const [showFrom, setShowFrom] = useState(false);

  const onChangeFrom = (event: any, selectedDate: Date) => {
    const currentDateFrom = selectedDate || dateFrom;
    setShowFrom(Platform.OS === 'ios');
    WordclockDataContext.setDateFrom(currentDateFrom);
    const stringfrom =
      selectedDate.getHours() + ':' + selectedDate.getMinutes();
    WordclockDataContext.setNightmodeFrom(stringfrom);
  };

  const [showTo, setShowTo] = useState(false);

  const onChangeTo = (event: any, selectedDate: Date) => {
    const currentDateTo = selectedDate || dateTo;
    setShowTo(Platform.OS === 'ios');
    WordclockDataContext.setDateTo(currentDateTo);
    const stringfrom =
      selectedDate.getHours() + ':' + selectedDate.getMinutes();
    WordclockDataContext.setNightmodeTo(stringfrom);
  };

  const [GMTList, setGMTList] = useState([
    {label: 'GMT-12', value: '-12'},
    {label: 'GMT-11', value: '-11'},
    {label: 'GMT-10', value: '-10'},
    {label: 'GMT-9', value: '-9'},
    {label: 'GMT-8', value: '-8'},
    {label: 'GMT-7', value: '-7'},
    {label: 'GMT-6', value: '-6'},
    {label: 'GMT-5', value: '-5'},
    {label: 'GMT-4', value: '-4'},
    {label: 'GMT-3', value: '-3'},
    {label: 'GMT-2', value: '-2'},
    {label: 'GMT-1', value: '-1'},
    {label: 'GMT0', value: '0'},
    {label: 'GMT+1', value: '1'},
    {label: 'GMT+2', value: '2'},
    {label: 'GMT+3', value: '3'},
    {label: 'GMT+4', value: '4'},
    {label: 'GMT+5', value: '5'},
    {label: 'GMT+6', value: '6'},
    {label: 'GMT+7', value: '7'},
    {label: 'GMT+8', value: '8'},
    {label: 'GMT+9', value: '9'},
    {label: 'GMT+10', value: '10'},
    {label: 'GMT+11', value: '11'},
    {label: 'GMT+12', value: '12'},
    {label: 'GMT+13', value: '13'},
    {label: 'GMT+14', value: '14'},
  ]);

  return (
    <View>
      <ConnectionIndicator />

      <View style={styles.rowView}>
        <Text style={styles.titleText}>Time</Text>
      </View>

      <View style={styles.rowView}>
        <Text style={styles.baseText}>Timezone</Text>
      </View>
      <RNPickerSelect
        onValueChange={value => WordclockDataContext.setTimezone(value)}
        value={WordclockDataContext.timezone}
        items={GMTList}
      />
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Automatic Summertime?</Text>
        <CheckBox
          disabled={false}
          value={WordclockDataContext.summertime}
          onValueChange={newValue =>
            WordclockDataContext.setSummertime(newValue)
          }
        />
      </View>

      <Divider width={2} />

      <View style={styles.rowView}>
        <Text style={styles.titleText}>Nightmode</Text>
      </View>

      <View style={styles.rowView}>
        <Text style={styles.baseText && {width: 100}}>From</Text>

        <TouchableOpacity style={{width: 100}}>
          <Button
            onPress={() => setShowFrom(true)}
            title={WordclockDataContext.nightmodeFrom}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rowView}>
        <Text style={styles.baseText && {width: 100}}>To</Text>

        <TouchableOpacity style={{width: 100}}>
          <Button
            onPress={() => setShowTo(true)}
            title={WordclockDataContext.nightmodeTo}
          />
        </TouchableOpacity>
      </View>

      {showFrom && (
        <DateTimePicker
          testID="dateTimePicker"
          value={WordclockDataContext.dateFrom}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeFrom}
        />
      )}

      {showTo && (
        <DateTimePicker
          testID="dateTimePicker"
          value={WordclockDataContext.dateTo}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTo}
        />
      )}

      <View style={styles.rowView}>
        <Text style={styles.baseText && {width: 150}}>Activate?</Text>
        <CheckBox
          disabled={false}
          value={WordclockDataContext.nightmode}
          onValueChange={newValue => {
            WordclockDataContext.setNightmode(newValue);
          }}
        />
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
          WordclockDataContext.setNightmodebright(value[0])
        }
      />
    </View>
  );
}
