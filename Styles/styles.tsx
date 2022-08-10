import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  baseText: {
    fontSize: 15,
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rowView: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    marginTop: '30%',
  },
});
