#include <libraries.h>
#include <global_variables.h>

void refreshInterface();
void setColor();

// Connect to router network and return 1 (success) or -1 (no success)
int WiFi_RouterNetworkConnect(String txtSSID, String txtPassword)
{
  char *SSID = const_cast<char *>(txtSSID.c_str());
  char *Password = const_cast<char *>(txtPassword.c_str());
  int success = 1;

  WiFi.begin(SSID, Password);
  WiFi.setHostname(HOSTNAME);

  // we wait until connection is established
  // or 10 seconds are gone

  int WiFiConnectTimeOut = 0;
  while ((WiFi.status() != WL_CONNECTED) && (WiFiConnectTimeOut < 10))
  {
    delay(1000);
    WiFiConnectTimeOut++;
  }

  // not connected
  if (WiFi.status() != WL_CONNECTED)
  {
    success = -1;
    wificonnected = false;
  }
  else
  {
    wificonnected = true;
  }

  Serial.println(WiFi.localIP());

  return success;
}

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    Serial.println("Connected");
  };

  void onDisconnect(BLEServer *pServer)
  {
    Serial.println("Disconnected");
  }
};

class CharacteristicsCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    Serial.print("Value Written ");
    Serial.println(pCharacteristic->getValue().c_str());
    pCharacteristic->notify();

    if (pCharacteristic == nightmode_characteristic)
    {
      NightmodeActive = pCharacteristic->getValue().c_str();
      preferences.putString("NightmodeActive", NightmodeActive);
      refreshInterface();
    }

    if (pCharacteristic == nightmodebright_characteristic)
    {
      NightmodeBrightnessPercent = pCharacteristic->getValue().c_str();
      preferences.putString("NightPerc", NightmodeBrightnessPercent);
      refreshInterface();
    }

    if (pCharacteristic == nightmodefrom_characteristic)
    {
      NightmodeFrom = pCharacteristic->getValue().c_str();
      preferences.putString("NightmodeFrom", NightmodeFrom);
      refreshInterface();
    }

    if (pCharacteristic == nightmodeto_characteristic)
    {
      NightmodeTo = pCharacteristic->getValue().c_str();
      preferences.putString("NightmodeTo", NightmodeTo);
      refreshInterface();
    }

    if (pCharacteristic == summertime_characteristic)
    {
      SummertimeActive = pCharacteristic->getValue().c_str();
      preferences.putString("DST", SummertimeActive);
      refreshInterface();
    }

    if (pCharacteristic == timezone_characteristic)
    {
      TimezoneUMT = pCharacteristic->getValue().c_str();
      preferences.putString("Timezone", TimezoneUMT);
      refreshInterface();
    }

    if (pCharacteristic == color_characteristic)
    {
      ColorInHex = pCharacteristic->getValue().c_str();
      preferences.putString("ColorHEX", ColorInHex);
      refreshInterface();
    }

    if (pCharacteristic == brightness_characteristic)
    {
      BrightnessPercent = pCharacteristic->getValue().c_str();
      preferences.putString("Perc", BrightnessPercent);
      refreshInterface();
    }

    if (pCharacteristic == ssid_characteristic)
    {
      WIFISSID = pCharacteristic->getValue().c_str();
      preferences.putString("SSID", WIFISSID);
    }

    if (pCharacteristic == password_characteristic)
    {
      WIFIPassword = pCharacteristic->getValue().c_str();
      preferences.putString("Password", WIFIPassword);
      message_characteristic->setValue("Connecting to new Network");
      message_characteristic->notify();

      if (WiFi.status() == WL_CONNECTED)
      {
        WiFi.disconnect();
      }

      WiFi_RouterNetworkConnect(WIFISSID, WIFIPassword);
    }
  }
};

void setColor()
{

  long number = (long)strtol(&ColorInHex[1], NULL, 16);
  redval = number >> 16;
  blueval = number >> 8 & 0xFF;
  greenval = number & 0xFF;
}

void setLedList(int LedList[], int length, int redval, int greenval, int blueval)
{
  length = length / sizeof(int);
  for (int i = 0; i < length; i++)
  {
    leds[(LedList[i])] = CRGB(redval, greenval, blueval);
  }
}

void sethour(int h) // Stunden setzen
{
  if (h == 13)
  {
    h = 1;
  }
  if (h == 0)
  {
    h = 12;
  }

  switch (h)
  {
  case 1:
    setLedList(stunde1, sizeof(stunde1), redval, blueval, greenval);
    break;

  case 2:
    setLedList(stunde2, sizeof(stunde2), redval, blueval, greenval);
    break;

  case 3:
    setLedList(stunde3, sizeof(stunde3), redval, blueval, greenval);
    break;

  case 4:
    setLedList(stunde4, sizeof(stunde4), redval, blueval, greenval);
    break;
  case 5:
    setLedList(stunde5, sizeof(stunde5), redval, blueval, greenval);
    break;
  case 6:
    setLedList(stunde6, sizeof(stunde6), redval, blueval, greenval);
    break;
  case 7:
    setLedList(stunde7, sizeof(stunde7), redval, blueval, greenval);
    break;
  case 8:
    setLedList(stunde8, sizeof(stunde8), redval, blueval, greenval);
    break;
  case 9:
    setLedList(stunde9, sizeof(stunde9), redval, blueval, greenval);
    break;
  case 10:
    setLedList(stunde10, sizeof(stunde10), redval, blueval, greenval);
    break;
  case 11:
    setLedList(stunde11, sizeof(stunde11), redval, blueval, greenval);
    break;
  case 12:
    setLedList(stunde12, sizeof(stunde12), redval, blueval, greenval);
    break;
  }
}

void setminutes(int m, int h) // minuten setzen
{
  FastLED.clear();

  // ES IST
  setLedList(esist, sizeof(esist), redval, blueval, greenval);

  int e = 0;
  e = m % 10;

  if ((m >= 0 && m < 5) || m == 60)
  {
    sethour(h);
    if (h == 1)
    {
      leds[56] = CRGB::Black;
    }
  }

  if (m >= 5 && m < 10)
  {
    sethour(h);
    setLedList(fuenf, sizeof(fuenf), redval, blueval, greenval);
    setLedList(nach, sizeof(nach), redval, blueval, greenval);
  }

  if (m >= 10 && m < 15)
  {
    sethour(h);
    setLedList(zehn, sizeof(zehn), redval, blueval, greenval);
    setLedList(nach, sizeof(nach), redval, blueval, greenval);
  }

  if (m >= 15 && m < 20)
  {
    sethour(h);
    setLedList(viertel, sizeof(viertel), redval, blueval, greenval);
    setLedList(nach, sizeof(nach), redval, blueval, greenval);
  }

  if (m >= 20 && m < 25)
  {
    sethour(h);
    setLedList(zwanzig, sizeof(zwanzig), redval, blueval, greenval);
    setLedList(nach, sizeof(nach), redval, blueval, greenval);
  }

  if (m >= 25 && m < 30)
  {
    sethour(h);
    setLedList(fuenf, sizeof(fuenf), redval, blueval, greenval);
    setLedList(zwanzig, sizeof(zwanzig), redval, blueval, greenval);
    setLedList(nach, sizeof(nach), redval, blueval, greenval);
  }

  if (m >= 30 && m < 35)
  {

    sethour(h + 1);

    // HALB
    setLedList(halb, sizeof(halb), redval, blueval, greenval);
  }

  if (m >= 35 && m < 40)
  {
    sethour(h + 1);
    setLedList(fuenf, sizeof(fuenf), redval, blueval, greenval);
    setLedList(zwanzig, sizeof(zwanzig), redval, blueval, greenval);
    setLedList(vor, sizeof(vor), redval, blueval, greenval);
  }

  if (m >= 40 && m < 45)
  {
    sethour(h + 1);
    setLedList(zwanzig, sizeof(zwanzig), redval, blueval, greenval);
    setLedList(vor, sizeof(vor), redval, blueval, greenval);
  }

  if (m >= 45 && m < 50)
  {
    sethour(h + 1);
    setLedList(viertel, sizeof(viertel), redval, blueval, greenval);
    setLedList(vor, sizeof(vor), redval, blueval, greenval);
  }

  if (m >= 50 && m < 55)
  {
    sethour(h + 1);
    setLedList(zehn, sizeof(zehn), redval, blueval, greenval);
    setLedList(vor, sizeof(vor), redval, blueval, greenval);
  }

  if (m >= 55 && m < 60)
  {
    sethour(h + 1);
    setLedList(fuenf, sizeof(fuenf), redval, blueval, greenval);
    setLedList(vor, sizeof(vor), redval, blueval, greenval);
  }

  if (e >= 5)
  {
    e = e - 5;
  }

  switch (e)
  { // ecken setzten

  case 1:
    setLedList(min1, sizeof(min1), redval, blueval, greenval);
    break;
  case 2:
    setLedList(min2, sizeof(min2), redval, blueval, greenval);
    break;
  case 3:
    setLedList(min3, sizeof(min3), redval, blueval, greenval);
    break;
  case 4:
    setLedList(min4, sizeof(min4), redval, blueval, greenval);
    break;
  }
  FastLED.show();
  delay(50);
}

void initvalues()
{
  preferences.begin("Wordclock", false);

  // takeout Strings out of the Non-volatile storage
  String strSSID = preferences.getString("SSID", "");
  String strPassword = preferences.getString("Password", "");
  String strTimezone = preferences.getString("Timezone", "");
  String strSummertimeActive = preferences.getString("DST", "");
  String strColorHex = preferences.getString("ColorHEX", "");
  String strNightmodeActive = preferences.getString("NightmodeActive", "");
  String strNightmodeFrom = preferences.getString("NightmodeFrom", "");
  String strNightmodeTo = preferences.getString("NightmodeTo", "");
  String strBrightnessPercent = preferences.getString("Perc", "");
  String strNightmodeBrightness = preferences.getString("NightPerc", "");

  // put the NVS stored values in RAM for the program if they contain information
  if (strColorHex != "")
  {
    ColorInHex = strColorHex;
  }
  else
  {
    preferences.putString("ColorHEX", ColorInHex);
  }

  if (strBrightnessPercent != "")
  {
    BrightnessPercent = strBrightnessPercent;
  }
  else
  {
    preferences.putString("Perc", BrightnessPercent);
  }

  if (strTimezone != "")
  {
    TimezoneUMT = strTimezone;
  }
  else
  {
    preferences.putString("Timezone", TimezoneUMT);
  }

  if (strSummertimeActive != "")
  {
    SummertimeActive = strSummertimeActive;
  }
  else
  {
    preferences.putString("DST", SummertimeActive);
  }

  if (strNightmodeFrom != "")
  {
    NightmodeFrom = strNightmodeFrom;
  }
  else
  {
    preferences.putString("NightmodeFrom", NightmodeFrom);
  }

  if (strNightmodeTo != "")
  {
    NightmodeTo = strNightmodeTo;
  }
  else
  {
    preferences.putString("NightmodeTo", NightmodeTo);
  }

  if (strNightmodeActive != "")
  {
    NightmodeActive = strNightmodeActive;
  }
  else
  {
    preferences.putString("NightmodeActive", NightmodeActive);
  }

  if (strNightmodeBrightness != "")
  {
    NightmodeBrightnessPercent = strNightmodeBrightness;
  }
  else
  {
    preferences.putString("NightPerc", BrightnessPercent);
  }

  if (strSSID != "")
  {
    WIFISSID = strSSID;
  }
  else
  {
    preferences.putString("SSID", WIFISSID);
  }

  if (strPassword != "")
  {
    WIFIPassword = strPassword;
  }
  else
  {
    preferences.putString("Password", WIFIPassword);
  }
}

byte calcDayOfWeek(byte y, byte m, byte d)
{
  // Old mental arithmetic method for calculating day of week
  // adapted for Arduino, for years 2000~2099
  // returns 1 for Sunday, 2 for Monday, etc., up to 7 for Saturday
  // for "bad" dates (like Feb. 30), it returns 0
  // Note: input year (y) should be a number from 0~99
  if (y > 99)
    return 0; // we don't accept years after 2099
  // we take care of bad months later
  if (d < 1)
    return 0; // because there is no day 0
  byte w = 6; // this is a magic number (y2k fix for this method)
  // one ordinary year is 52 weeks + 1 day left over
  // a leap year has one more day than that
  // we add in these "leftover" days
  w += (y + (y >> 2));
  // correction for Jan. and Feb. of leap year
  if (((y & 3) == 0) && (m <= 2))
    w--;
  // add in "magic number" for month
  switch (m)
  {
  case 1:
    if (d > 31)
      return 0;
    w += 1;
    break;
  case 2:
    if (d > ((y & 3) ? 28 : 29))
      return 0;
    w += 4;
    break;
  case 3:
    if (d > 31)
      return 0;
    w += 4;
    break;
  case 4:
    if (d > 30)
      return 0;
    break;
  case 5:
    if (d > 31)
      return 0;
    w += 2;
    break;
  case 6:
    if (d > 30)
      return 0;
    w += 5;
    break;
  case 7:
    if (d > 31)
      return 0;
    break;
  case 8:
    if (d > 31)
      return 0;
    w += 3;
    break;
  case 9:
    if (d > 30)
      return 0;
    w += 6;
    break;
  case 10:
    if (d > 31)
      return 0;
    w += 1;
    break;
  case 11:
    if (d > 30)
      return 0;
    w += 4;
    break;
  case 12:
    if (d > 31)
      return 0;
    w += 6;
    break;
  default:
    return 0;
  }
  // then add day of month
  w += d;
  // there are only 7 days in a week, so we "cast out" sevens
  while (w > 7)
    w = (w >> 3) + (w & 7);
  return w;
}

// Adjusts for daylightsavings
void clockGen()
{
  dow = calcDayOfWeek(years, months, days);
  if (months <= 2 || months >= 11)
    DST = false; // Winter months
  if (months >= 4 && months <= 9)
    DST = true; // Summer months
  //***  Detect the beginning of theU DST in March and set DST = 1
  if (months == 3 && days - dow >= 25)
  {                       // Begin of summer time
    if (stunden >= 3 - 1) // MESZ – 1 hour
      DST = true;
  }

  //***  Still summer months time DST beginning of October, so easy to determine
  if (months == 10 && days - dow < 25)
    DST = true;
  if (months == 10 && days - dow >= 25)
  {
    if (stunden >= 3 - 1)
    {
      DST = false;
      //     Serial.println("We have winter time");
    }
    else
    {
      DST = true;
      //    Serial.println("A good day! We have summer time");
    }
  }
  if (DST == true)
    stunden += 1; // Add 1 hour due to detected DST
}

String split(String s, char parser, int index)
{
  String rs = "";
  // int parserIndex = index;
  int parserCnt = 0;
  int rFromIndex = 0, rToIndex = -1;
  while (index >= parserCnt)
  {
    rFromIndex = rToIndex + 1;
    rToIndex = s.indexOf(parser, rFromIndex);
    if (index == parserCnt)
    {
      if (rToIndex == 0 || rToIndex == -1)
        return "";
      return s.substring(rFromIndex, rToIndex);
    }
    else
      parserCnt++;
  }
  return rs;
}

void dealwithnighttime()
{
  boolean nighttime = false;

  String temphstart = NightmodeFrom;
  String temphend = NightmodeTo;
  String tempmstart = NightmodeFrom;
  String tempmend = NightmodeTo;

  int temphourstart = split(temphstart, ':', 0).toInt();
  int temphourend = split(temphend, ':', 0).toInt();
  int tempminstart = NightmodeFrom.substring(3, 5).toInt();
  int tempminend = NightmodeTo.substring(3, 5).toInt();

  if (NightmodeActive.toInt() == 1)
  {
    if (temphourstart > temphourend)
    {
      if (stunden >= temphourstart || stunden <= temphourend)
      {
        // nachthelligkeit
        if (stunden != temphourstart && stunden != temphourend)
        {
          nighttime = true;
        }

        if (stunden == temphourstart && minuten >= tempminstart)
        {
          nighttime = true;
        }
        if (stunden == temphourend && minuten <= tempminend)
        {
          nighttime = true;
        }
      }
    }

    if (temphourstart == temphourend)
    {
      if (stunden == temphourstart && stunden == temphourend)
      {

        if (minuten >= tempminstart && minuten <= tempminend)
        {
          nighttime = true;
        }
      }
    }

    if (temphourstart < temphourend)
    {

      if (stunden >= temphourstart && stunden <= temphourend)
      {
        // Nacht
        if (stunden != temphourstart && stunden != temphourend)
        {
          nighttime = true;
        }
        if (stunden == temphourstart && minuten >= tempminstart)
        {
          nighttime = true;
        }
        if (stunden == temphourend && minuten <= tempminend)
        {
          nighttime = true;
        }
      }
    }
  }

  if (nighttime == true)
  {
    FastLED.setBrightness(map(NightmodeBrightnessPercent.toInt(), 0, 100, 0, 255));
  }
  else
  {
    FastLED.setBrightness(map(BrightnessPercent.toInt(), 0, 100, 0, 255));
  }
}

void updateTime()
{
  const char *ntpServer = "pool.ntp.org";

  const long gmtOffset_sec = 0;
  const int daylightOffset_sec = 0;

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;

  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
    return;
  }
  stunden = timeinfo.tm_hour;
  minuten = timeinfo.tm_min;
  sekunden = timeinfo.tm_sec;
  years = timeinfo.tm_year + 1900;
  months = timeinfo.tm_mon + 1;
  days = timeinfo.tm_mday;

  if (SummertimeActive.toInt() == 1)
  {
    clockGen();
  }

  stunden = stunden + TimezoneUMT.toInt();

  if (stunden < 12)
  {
    stunden = stunden + 24;
  }
  if (stunden > 24)
  {
    stunden = stunden - 24;
  }

  dealwithnighttime();

  if (stunden > 12)
  {
    stunden = stunden - 12;
  }
}

void Wifireconnect()
{
  if (reconnecttimer - millis() > 5000)
  {
    //   Serial.println("Attempting to reconnect");
    String strSSID = preferences.getString("SSID", "");
    String strPassword = preferences.getString("Password", "");

    char *txtSSID = const_cast<char *>(strSSID.c_str());
    char *txtPassword = const_cast<char *>(strPassword.c_str());

    WiFi.begin(txtSSID, txtPassword);
    WiFi.setHostname(HOSTNAME);
    reconnecttimer = millis();
  }
}

void setup()
{
  Serial.begin(115200);

  // INITIALIZE LEDs
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);

  // Retrieve Configuration from FLASH
  initvalues();

  // Create the BLE Device
  BLEDevice::init("WordclockBLE");
  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  // Create the BLE Service
  BLEService *pService = pServer->createService(GENERAL_SERVICE_UUID);
  delay(100);
  BLEService *pNightService = pServer->createService(NIGHT_SERVICE_UUID);
  delay(100);
  BLEService *pWifiService = pServer->createService(WIFI_SERVICE_UUID);
  delay(100);

  // Create a BLE Characteristic
  nightmode_characteristic = pNightService->createCharacteristic(
      NIGHTMODE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  nightmodebright_characteristic = pNightService->createCharacteristic(
      NIGHTMODEBRIGHT_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  summertime_characteristic = pService->createCharacteristic(
      SUMMERTIME_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  nightmodefrom_characteristic = pNightService->createCharacteristic(
      NIGHTMODEFROM_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  nightmodeto_characteristic = pNightService->createCharacteristic(
      NIGHTMODETO_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  timezone_characteristic = pService->createCharacteristic(
      TIMEZONE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  brightness_characteristic = pService->createCharacteristic(
      BRIGHTNETT_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  color_characteristic = pService->createCharacteristic(
      COLOR_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  wificonnected_characteristic = pWifiService->createCharacteristic(
      WIFICONNECTED_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  ssid_characteristic = pWifiService->createCharacteristic(
      SSID_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  password_characteristic = pWifiService->createCharacteristic(
      PASSWORD_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_WRITE |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  message_characteristic = pWifiService->createCharacteristic(
      MESSAGE_CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_NOTIFY |
          BLECharacteristic::PROPERTY_INDICATE);

  // Start the BLE service
  pService->start();
  pNightService->start();
  pWifiService->start();

  // Start advertising
  pServer->getAdvertising()->start();

  message_characteristic->setValue("");

  nightmode_characteristic->setValue(const_cast<char *>(NightmodeActive.c_str()));
  nightmode_characteristic->setCallbacks(new CharacteristicsCallbacks());

  nightmodebright_characteristic->setValue(const_cast<char *>(NightmodeBrightnessPercent.c_str()));
  nightmodebright_characteristic->setCallbacks(new CharacteristicsCallbacks());

  nightmodefrom_characteristic->setValue(const_cast<char *>(NightmodeFrom.c_str()));
  nightmodefrom_characteristic->setCallbacks(new CharacteristicsCallbacks());

  nightmodeto_characteristic->setValue(const_cast<char *>(NightmodeTo.c_str()));
  nightmodeto_characteristic->setCallbacks(new CharacteristicsCallbacks());

  timezone_characteristic->setValue(const_cast<char *>(TimezoneUMT.c_str()));
  timezone_characteristic->setCallbacks(new CharacteristicsCallbacks());

  summertime_characteristic->setValue(const_cast<char *>(SummertimeActive.c_str()));
  summertime_characteristic->setCallbacks(new CharacteristicsCallbacks());

  brightness_characteristic->setValue(const_cast<char *>(BrightnessPercent.c_str()));
  brightness_characteristic->setCallbacks(new CharacteristicsCallbacks());

  color_characteristic->setValue(const_cast<char *>(ColorInHex.c_str()));
  color_characteristic->setCallbacks(new CharacteristicsCallbacks());

  wificonnected_characteristic->setValue("0");
  wificonnected_characteristic->setCallbacks(new CharacteristicsCallbacks());

  ssid_characteristic->setValue(const_cast<char *>(WIFISSID.c_str()));
  ssid_characteristic->setCallbacks(new CharacteristicsCallbacks());

  password_characteristic->setValue(const_cast<char *>(WIFIPassword.c_str()));
  password_characteristic->setCallbacks(new CharacteristicsCallbacks());

  Serial.println("Waiting for a client connection to notify...");

  // connect to WIFI

  WiFi_RouterNetworkConnect(WIFISSID, WIFIPassword);

  refreshInterface();
}

void refreshInterface()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    if (wificonnected == true)
    {
      wificonnected_characteristic->setValue("0");
      wificonnected_characteristic->notify();
    }
    wificonnected = false;
    Wifireconnect();
  }
  else
  {
    if (wificonnected == false)
    {
      wificonnected_characteristic->setValue("1");
      wificonnected_characteristic->notify();
      wificonnected = true;
    }
    updateTime();
  }
  setColor();
  setminutes(minuten, stunden);
  maintimer = millis();

  Serial.print(stunden);
  Serial.print(':');
  Serial.print(minuten);
  Serial.println();
}

void loop()
{

  if (millis() - maintimer > 5000)
  {
    refreshInterface();
  }
  delay(50);
}