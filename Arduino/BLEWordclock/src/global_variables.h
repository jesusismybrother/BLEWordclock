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
int min1[1] = {102};
int min2[2] = {102, 0};
int min3[3] = {102, 0, 113};
int min4[4] = {102, 0, 113, 11};



// DE
int DE_five[4] = {1, 21, 22, 41};
int DE_ten[4] = {80, 83, 100, 104};
int DE_quarter[7] = {3, 19, 24, 39, 44, 59, 64};
int DE_twenty[7] = {2, 20, 23, 40, 43, 60, 63};
int DE_half[4] = {77, 86, 97, 107};
int DE_to[3] = {25, 38, 45};
int DE_past[4] = {58, 65, 78, 85};
int DE_ItIs[5] = {61, 62, 81, 101, 103};
int DE_hour1[4] = {56, 67, 76, 87};
int DE_hour2[4] = {76, 87, 96, 108};
int DE_hour3[4] = {68, 75, 88, 95};
int DE_hour4[4] = {8, 14, 29, 34};
int DE_hour5[4] = {7, 15, 28, 35};
int DE_hour6[5] = {52, 71, 72, 91, 92};
int DE_hour7[6] = {6, 16, 27, 36, 47, 56};
int DE_hour8[4] = {70, 73, 90, 93};
int DE_hour9[4] = {49, 54, 69, 74};
int DE_hour10[4] = {30, 33, 50, 53};
int DE_hour11[3] = {89, 94, 110};
int DE_hour12[5] = {17, 26, 37, 46, 57};
int DE_OClock[3] = {10, 12, 31};


// EN
int EN_five[4] = {44,39,24,19};
int EN_ten[3] = {23,20,2};
int EN_quarter[7] = {104,100,83,80,60,43,63};
int EN_twenty[6] = {105,99,84,79,64,59};
int EN_half[4] = {42,41,22,21};
int EN_to[2] = {58,45};
int EN_past[4] = {106,98,85,78};
int EN_ItIs[4] = {103,101,81,62};
int EN_hour1[4] = {37,26,17};
int EN_hour2[3] = {25,18,4};
int EN_hour3[5] = {49,34,29,14,8};
int EN_hour4[3] = {110,94,89};
int EN_hour5[4] = {96,87,76,67};
int EN_hour6[3] = {30,13,9};
int EN_hour7[5] = {47,36,27,16,6};
int EN_hour8[5] = {90,73,70,53,50};
int EN_hour9[4] = {12,92,91,72};
int EN_hour10[4] = {35,28,15,7};
int EN_hour11[6] = {107,97,86,77,66,57};
int EN_hour12[6] = {109,95,88,75,68,55};
int EN_OClock[6] = {52,51,32,31,12,10};

const int numberLenguages=2;


int *five[numberLenguages] = {DE_five,EN_five};
int *ten[numberLenguages] = {DE_ten,EN_ten};
int *quarter[numberLenguages] = {DE_quarter,EN_quarter};
int *twenty[numberLenguages] = {DE_twenty,EN_twenty};
int *half[numberLenguages] = {DE_half,EN_half};
int *to[numberLenguages] = {DE_to,EN_to};
int *past[numberLenguages] = {DE_past,EN_past};
int *ItIs[numberLenguages] = {DE_ItIs,EN_ItIs};
int *hour1[numberLenguages] = {DE_hour1,EN_hour1};
int *hour2[numberLenguages] = {DE_hour2,EN_hour2};
int *hour3[numberLenguages] = {DE_hour3,EN_hour3};
int *hour4[numberLenguages] = {DE_hour4,EN_hour4};
int *hour5[numberLenguages] = {DE_hour5,EN_hour5};
int *hour6[numberLenguages] = {DE_hour6,EN_hour6};
int *hour7[numberLenguages] = {DE_hour7,EN_hour7};
int *hour8[numberLenguages] = {DE_hour8,EN_hour8};
int *hour9[numberLenguages] = {DE_hour9,EN_hour9};
int *hour10[numberLenguages] = {DE_hour10,EN_hour10};
int *hour11[numberLenguages] = {DE_hour11,EN_hour11};
int *hour12[numberLenguages] = {DE_hour12,EN_hour12};
int *OClock[numberLenguages] = {DE_OClock,EN_OClock};


int len_five[numberLenguages] = {4,4};
int len_ten[numberLenguages] = {4,3};
int len_quarter[numberLenguages] = {7,7};
int len_twenty[numberLenguages] = {7,6};
int len_half[numberLenguages] = {4,4};
int len_to[numberLenguages] = {3,2};
int len_past[numberLenguages] = {4,4};
int len_ItIs[numberLenguages] = {5,4};
int len_hour1[numberLenguages] = {4,3};
int len_hour2[numberLenguages] = {4,3};
int len_hour3[numberLenguages] = {4,5};
int len_hour4[numberLenguages] = {4,3};
int len_hour5[numberLenguages] = {4,4};
int len_hour6[numberLenguages] = {5,3};
int len_hour7[numberLenguages] = {6,5};
int len_hour8[numberLenguages] = {4,5};
int len_hour9[numberLenguages] = {4,4};
int len_hour10[numberLenguages] = {4,4};
int len_hour11[numberLenguages] = {3,6};
int len_hour12[numberLenguages] = {5,6};
int len_OClock[numberLenguages] = {3,6};






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
String WIFISSID = "setup";
String WIFIPassword = "12345678";
String Language = "1";
String DeviceName = "Wordclock";

// 0=DE
// 1=EN


// Timekeeping
int rtcpresent = 0;
int hours;
int minutes;
int seconds;
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
bool isConnected = false;
long heartbeatTimer = 0;
int connectionID = 0;
BLEServer *pServer = NULL;

BLECharacteristic *summertime_characteristic = NULL;
BLECharacteristic *timezone_characteristic = NULL;

BLECharacteristic *nightmode_characteristic = NULL;
BLECharacteristic *nightmodebright_characteristic = NULL;
BLECharacteristic *nightmodefrom_characteristic = NULL;
BLECharacteristic *nightmodeto_characteristic = NULL;

BLECharacteristic *color_characteristic = NULL;
BLECharacteristic *brightness_characteristic = NULL;
BLECharacteristic *heartbeat_characteristic = NULL;
BLECharacteristic *language_characteristic = NULL;

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
#define BRIGHTNETT_CHARACTERISTIC_UUID "5b1d822c-20ac-4286-a1ac-dd991d6b3e8f"
#define COLOR_CHARACTERISTIC_UUID "63311740-35c8-4f20-9453-51c12f4bba04"
#define HEARTBEAT_CHARACTERISTIC_UUID "90853600-1dbb-4e78-9510-ec7a5762bed5"
#define LANGUAGE_CHARACTERISTIC_UUID "7e196076-ffc6-40f9-817d-2e090b669f92"

#define WIFI_SERVICE_UUID "f7c75cd0-2082-4fd1-8d7d-94523bc32688"

#define MESSAGE_CHARACTERISTIC_UUID "7cb38031-e0ae-4fa3-b365-df54564b33bc"
#define WIFICONNECTED_CHARACTERISTIC_UUID "9822a39c-066f-4c24-888b-7b825be94ec2"
#define SSID_CHARACTERISTIC_UUID "b16da357-b7bf-4825-b2cd-25790570af6f"
#define PASSWORD_CHARACTERISTIC_UUID "f16b1d63-b8d7-4531-94a7-551102fe5a8a"