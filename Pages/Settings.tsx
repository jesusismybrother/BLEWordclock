import {Text, View, Button, Platform, TouchableOpacity} from 'react-native';

import React, {useState, useContext} from 'react';

import {Divider} from 'react-native-elements';

import RNPickerSelect from 'react-native-picker-select';

import CheckBox from '@react-native-community/checkbox';

import {Slider} from '@miblanchard/react-native-slider';

import {styles} from '../Styles/styles';

import DateTimePicker from '@react-native-community/datetimepicker';

import {ConnectionContext} from '../AppContext/Appcontext';

import {ConnectionIndicator} from '../Components/connectionIndicator';

export function Settings() {
  const connectionContext = useContext(ConnectionContext);

  const [sliderState, setSliderState] = useState(0.0);

  const [summertimeState, setSummertimeState] = useState(false);

  const [nightmodeState, setNightmodeState] = useState(false);

  const [dateFrom, setDateFrom] = useState(new Date(1598051730000));
  const [showFrom, setShowFrom] = useState(false);

  const onChangeFrom = (event, selectedDate) => {
    const currentDateFrom = selectedDate || dateFrom;
    setShowFrom(Platform.OS === 'ios');
    setDateFrom(currentDateFrom);
    console.log(dateFrom.getHours(), ':', dateFrom.getMinutes());
  };

  const showModeFrom = () => {
    setShowFrom(true);
  };

  const [dateTo, setDateTo] = useState(new Date(1598051730000));
  const [showTo, setShowTo] = useState(false);

  const onChangeTo = (event, selectedDate) => {
    const currentDateTo = selectedDate || dateTo;
    setShowTo(Platform.OS === 'ios');
    setDateTo(currentDateTo);
    console.log(dateTo.getHours(), ':', dateTo.getMinutes());
  };

  const showModeTo = () => {
    setShowTo(true);
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
        onValueChange={value => console.log(value)}
        value={'1'}
        placeholder={{
          label: 'GMT+1',
          value: '1',
        }}
        items={GMTList}
      />
      <View style={styles.rowView}>
        <Text style={styles.baseText}>Automatic Summertime?</Text>
        <CheckBox
          disabled={false}
          value={summertimeState}
          onValueChange={newValue => setSummertimeState(newValue)}
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
            onPress={showModeFrom}
            title={
              dateFrom.getHours().toString() +
              ':' +
              dateFrom.getMinutes().toString()
            }
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rowView}>
        <Text style={styles.baseText && {width: 100}}>To</Text>

        <TouchableOpacity style={{width: 100}}>
          <Button
            onPress={showModeTo}
            title={
              dateTo.getHours().toString() +
              ':' +
              dateTo.getMinutes().toString()
            }
          />
        </TouchableOpacity>
      </View>

      {showFrom && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateFrom}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeFrom}
        />
      )}

      {showTo && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateTo}
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
          value={nightmodeState}
          onValueChange={newValue => setNightmodeState(newValue)}
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
        step={1}
        onValueChange={value => setSliderState(value[0])}
      />
    </View>
  );
}
