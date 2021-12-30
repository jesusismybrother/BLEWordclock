//Backup stuff

<View style={styles.rowView}>
  {/* <Button title="Search" onPress={() => BLToptions.scanDevices()} /> */}

  <TouchableOpacity style={{width: 120}}>
    {BLToptions.isConnected ? (
      <Button
        title="Disconnect"
        onPress={() => {
          BLToptions.disconnectDevice();
        }}
      />
    ) : (
      <Button
        title="Connect"
        onPress={() => {
          // const item = BLToptions.foundDevices.find(
          //   dev => dev.value === selectedBT,
          // );
          // if (item != null) {
          // BLToptions.connectDevice(item.device);
          BLToptions.scanDevices();
          // }
        }}
        disabled={false}
      />
    )}
  </TouchableOpacity>
</View>;
{
  /* <RNPickerSelect
        onValueChange={value => {
          setSelectedBT(value);
        }}
        items={BLToptions.foundDevices}
      /> */
}
