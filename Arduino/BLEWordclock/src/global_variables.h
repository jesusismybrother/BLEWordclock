// LED Variables
#define DATA_PIN 13
#define LED_TYPE WS2812
#define COLOR_ORDER GRB
#define NUM_LEDS 115
#define FRAMES_PER_SECOND 60
CRGB leds[NUM_LEDS];

long maintimer = millis();
long reconnecttimer = millis();
int redval = 255;
int greenval = 255;
int blueval = 255;

// Adresses of individual LEDs in groups
int fuenf[4] = {1, 21, 22, 41};
int zehn[4] = {80, 83, 100, 104};
int viertel[7] = {3, 19, 24, 39, 44, 59, 64};
int zwanzig[7] = {2, 20, 23, 40, 43, 60, 63};
int halb[4] = {77, 86, 97, 107};

int vor[3] = {25, 38, 45};
int nach[4] = {58, 65, 78, 85};

int min1[1] = {102};
int min2[2] = {102, 0};
int min3[3] = {102, 0, 113};
int min4[4] = {102, 0, 113, 11};

int esist[5] = {61, 62, 81, 101, 103};

int stunde1[4] = {56, 67, 76, 87};
int stunde2[4] = {76, 87, 96, 108};
int stunde3[4] = {68, 75, 88, 95};
int stunde4[4] = {8, 14, 29, 34};
int stunde5[4] = {7, 15, 28, 35};
int stunde6[5] = {52, 71, 72, 91, 92};
int stunde7[6] = {6, 16, 27, 36, 47, 56};
int stunde8[4] = {70, 73, 90, 93};
int stunde9[4] = {49, 54, 69, 74};
int stunde10[4] = {30, 33, 50, 53};
int stunde11[3] = {89, 94, 110};
int stunde12[5] = {17, 26, 37, 46, 57};

// Configurations

// initialize config

String ColorInHex = "#FF0000";
String BrightnessPercent = "50";
String TimezoneUMT = "1";
String SummertimeActive = "1";
String NightmodeFrom = "22:00";
String NightmodeTo = "07:00";
String NightmodeActive = "0";
String NightmodeBrightnessPercent = "10";
String WIFISSID = "FRITZ!Box 6660 Cable DS";
String WIFIPassword = "00834435201708840594";

// Timekeeping
int rtcpresent = 0;
int stunden;
int minuten;
int sekunden;
String formattedDate;
String dayStamp;
String timeStamp;
char timestamp[9];
char datestamp[11];
byte dow;
byte days;   // Day (0 to 31)
byte months; // Month (0 to 12)
byte years;
boolean DST = false;

int summertime = 1;

// WIFI SECTION
WiFiClient myclient;
Preferences preferences;
int numbervalues = 15;
const char *HOSTNAME = "wordclock";
String ConfigName[16];  // name of the configuration value
String ConfigValue[16]; // the value itself (String)

String Wlanssid[50];
String Wlanrssi[50];

int numberWlan;
boolean wificonnected = false;
boolean newnetwork = false;

// BLE SECTION
BLEServer *pServer = NULL;

BLECharacteristic *summertime_characteristic = NULL;
BLECharacteristic *timezone_characteristic = NULL;

BLECharacteristic *nightmode_characteristic = NULL;
BLECharacteristic *nightmodebright_characteristic = NULL;
BLECharacteristic *nightmodefrom_characteristic = NULL;
BLECharacteristic *nightmodeto_characteristic = NULL;

BLECharacteristic *color_characteristic = NULL;
BLECharacteristic *brightness_characteristic = NULL;

BLECharacteristic *message_characteristic = NULL;

BLECharacteristic *wificonnected_characteristic = NULL;
BLECharacteristic *ssid_characteristic = NULL;
BLECharacteristic *password_characteristic = NULL;

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define NIGHT_SERVICE_UUID "0d8518ba-ed68-4583-a85e-6352b7bba0bc"

#define NIGHTMODE_CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define NIGHTMODEBRIGHT_CHARACTERISTIC_UUID "a10d6655-a7ab-41d5-b61b-05631d147fad"
#define NIGHTMODEFROM_CHARACTERISTIC_UUID "135765a3-58f9-401c-86e4-aa290444a7df"
#define NIGHTMODETO_CHARACTERISTIC_UUID "8ee0395f-8cf1-4599-88b7-265b5eec79d0"

#define GENERAL_SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

#define SUMMERTIME_CHARACTERISTIC_UUID "6d68efe5-04b6-4a85-abc4-c2670b7bf7fd"
#define TIMEZONE_CHARACTERISTIC_UUID "f27b53ad-c63d-49a0-8c0f-9f297e6cc520"

#define COLOR_CHARACTERISTIC_UUID "63311740-35c8-4f20-9453-51c12f4bba04"
#define BRIGHTNETT_CHARACTERISTIC_UUID "5b1d822c-20ac-4286-a1ac-dd991d6b3e8f"

#define MESSAGE_CHARACTERISTIC_UUID "7cb38031-e0ae-4fa3-b365-df54564b33bc"

#define WIFI_SERVICE_UUID "f7c75cd0-2082-4fd1-8d7d-94523bc32688"

#define MESSAGE_CHARACTERISTIC_UUID "7cb38031-e0ae-4fa3-b365-df54564b33bc"
#define WIFICONNECTED_CHARACTERISTIC_UUID "9822a39c-066f-4c24-888b-7b825be94ec2"
#define SSID_CHARACTERISTIC_UUID "b16da357-b7bf-4825-b2cd-25790570af6f"
#define PASSWORD_CHARACTERISTIC_UUID "f16b1d63-b8d7-4531-94a7-551102fe5a8a"