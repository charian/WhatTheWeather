import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Image,
  AppState,
  Dimensions,
  ToastAndroid,
  BackHandler
} from "react-native";
import { Font, LinearGradient } from "expo";
import AppNavigator from "./navigation/AppContainer";
import { createAppContainer } from "react-navigation";
import { WeatherContext } from "./Context";
import { Localization } from "expo-localization";
import i18n from "i18n-js";
import { API_KEY } from "./Keys";
import { air_KEY } from "./Keys";
import { ifIphoneX } from "react-native-iphone-x-helper";
import publicIP from "react-native-public-ip";

import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBGKpsEYb4Dr3pAfrotNTWGVvOLmS9-OGY"
  //authDomain: "whattheweather-8064a.firebaseapp.com",
  //databaseURL: "https://whattheweather-8064a.firebaseio.com"
  //storageBucket: "bucket.appspot.com"
};

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

const en = {
  airquality: "Air Quality",
  airqualityGood: "Good",
  airqualityModerate: "Moderate",
  airqualityUnfor: "Unhealthy for Sensitive Groups",
  airqualityUnhealthy: "Unhealthy",
  airqualityVUnhealthy: "Very Unhealthy",
  airqualityHazardous: "Hazardous",
  airqualityHazardous2: "Very Hazardous",
  menuTemp: "Temperature",
  thenYesterday: "lower than",
  thenYesterdayLower: " yesterday",
  thenYesterdayHigher: " yesterday",
  humidity: "Humidity",
  wind: "Wind",
  Hourly: "Hourly",
  Daily: "Daily",
  Weather: "Weather",
  Time: "Time",
  Temp: "Temp",
  Rain: "Rain",
  Snow: "Snow",
  Hail: "Hail",
  Feel: "Feel",
  UV: "UV",
  CloudCover: "Cloud\nCover",
  DewPoint: "Dew\nPoint",
  Visibility: "Visibility",
  min: "min",
  max: "max",
  day: "Day",
  night: "Night",
  sunset: "Sunset",
  sunrise: "Sunrise",
  Primary: "Primary pollutant",
  pm25Text: "Aerosol Particulate Matter",
  pm10Text: "Particulate Matter",
  no2Text: "Nitrogen Dioxide",
  so2Text: "Sulfur Dioxide",
  coText: "Carbon Monoxide",
  o3Text: "Ozone",
  goodRemark: "Every day seems like today!",
  moderRemark: "You can do external activities without a mask.",
  unforRemark:
    "It can be dangerous to vulnerable groups such as children, the elderly, and pregnant women.",
  unhealthyRemark:
    "If possible, do not go outside.\nPlease wear a mask if you are going out.",
  veryunRemark: "Never go outside without a mask.",
  hazardousRemark:
    "It does not matter if you do not wear a mask.\nDo not go outdoors unconditionally.",
  menuSetting: "Setting",
  addLocation: "Add Location",
  unit: "Unit",
  metric: "Metric",
  imperial: "Imperial",
  met: "Met",
  imp: "Imp",
  saveAnother: "Save Another Location",
  SavedLocations: "Locations",
  Add: "Add",
  remarkOfSearch: "Please enter at least 3 characters",
  locationPlaceholder: "Location keywords",
  realfeel:
    "The AccuWeather.com RealFeel® Temperature was created in the 1990s by Joel N. Myers, Michael A. Steinberg, Joseph Sobel, Elliot Abrams and Evan Myers. The  RealFeel Temperature is an equation that takes into  account many different factors to determine how the temperature actually feels outside. It is the first temperature to take into account multiple factors to determine how hot and cold feels. Some of the components that are used in the equation are humidity, cloud cover, winds, sun intensity and angle of the sun. Humidity is a large contributor to determining the RealFeel, but the time of the day also is important, due to the angle of the sun. In the morning the low angle of the sun gives off less heat because the energy is spread out, according to AccuWeather.com Expert Senior Meteorologist Dan Kottlowski. In the afternoon, the sun is overhead and the sun's energy is more direct and gives off more energy, making it feel warmer. 'The RealFeel takes into consideration the angle of the sun and its affects on an object or the body,' Kottlowski said. Once the equation was created, the inventors took the RealFeel to AccuWeather.com meteorologists, media and the public to make sure they weren't missing anything and to gather research on how they could improve the product, Steinberg said. The equation also takes into consideration how people perceive the weather. Steinberg said that this can be debated, since not everyone perceives weather the same way, but the equation uses the average person's perception of weather and adds that into the RealFeel equation. The RealFeel Temperature can be used throughout all four seasons with the same equation. Wind is a main component that determines how people perceive the weather and a factor that is used to determine the AccuWeather RealFeel. AccuWeather.com Senior Meteorologist Kristina Pydynowski, said that the wind can make a person feel colder because the cold wind blowing removes heat from your body. 'The stronger the wind, the faster the heat is getting removed from your body, so it will feel colder outside,' Pydynowski said. Humidity is another component in equating the RealFeel and also plays a role in how people feel outside. If there is low humidity in the air (meaning less moisture) when you sweat, the moisture is able to evaporate. This works as your body's cooling process, so you won't feel as hot. If there is high humidity in the air, the evaporating process is slowed down or stopped because there is already a lot of moisture in the air. 'That is why you get the sticky feeling, because the sweat isn't able to evaporate as efficiently,' Pydynowski said. The AccuWeather.com RealFeel Temperature is one of a kind because AccuWeather is the only company that can use more than two elements in its equation, to determine the RealFeel because of the patents that AccuWeather has, Steinberg said.",
  Preferences: "Preferences",
  Permission: "Location Permission",
  Enabled: "Allowed",
  Unnabled: "Unallowed",
  station: "Measuring station",
  Measuringtime: "Measuring time",
  locationtext: "Fetch New Data",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
  accurate:
    "It is more accurate to import location information with GPS. Please allow your app to use location information in your smartphone's settings"
};
//{i18n.t("airquality")}
const ko = {
  airquality: "대기질",
  airqualityGood: "좋음",
  airqualityModerate: "보통",
  airqualityUnfor: "민감군 안좋음",
  airqualityUnhealthy: "안좋음",
  airqualityVUnhealthy: "매우 안좋음",
  airqualityHazardous: "위험",
  airqualityHazardous2: "매우 위험",
  menuTemp: "온도",
  thenYesterday: "어제보다 ",
  thenYesterdayLower: " 낮습니다",
  thenYesterdayHigher: " 높습니다",
  humidity: "습도",
  wind: "바람",
  Hourly: "시간별",
  Daily: "일자별",
  Weather: "날씨",
  Time: "시간",
  Rain: "강수량",
  Snow: "적설량",
  Hail: "우박",
  Temp: "온도",
  Feel: "체감",
  UV: "자외선",
  CloudCover: "구름량",
  DewPoint: "이슬점",
  Visibility: "가시거리",
  min: "최저",
  max: "최대",
  day: "낮",
  night: "밤",
  sunset: "일몰",
  sunrise: "일출",
  Primary: "기준 오염",
  pm25Text: "초 미세먼지",
  pm10Text: "미세먼지",
  no2Text: "이산화 질소",
  so2Text: "이산화 황",
  coText: "일산화 탄소",
  o3Text: "오존",
  goodRemark: "이야! 매일매일 오늘만 같아라!",
  moderRemark: "마스크 없이 외부활동을 할 수 있습니다.",
  unforRemark:
    "노약자와 아이들, 임산부의 외출은 가급적 삼가하시는것이 좋습니다.\n굳이 외출 하시려면 마스크를 착용해주세요.",
  unhealthyRemark:
    "가급적이면 외출하지 않는것을 추천드립니다.\n굳이 외출 하시려면 마스크를 착용해주세요.",
  veryunRemark: "마스크 없이 절대 외출하지 마세요.",
  hazardousRemark: "마스크를 쓰던 말던, 무조건 외출 하지 않는것이 좋습니다.",
  menuSetting: "설정",
  addLocation: "지역 추가",
  unit: "단위",
  metric: "미터",
  imperial: "야드",
  met: "미터",
  imp: "야드",
  saveAnother: "다른지역 추가하기",
  SavedLocations: "저장된 지역들",
  Add: "추가하기",
  remarkOfSearch: "도로명 주소는 지원이 안됩니다.\n읍,면,동 으로 검색해주세요",
  locationPlaceholder: "읍, 면, 동",
  realfeel:
    "AccuWeather에서 제공하는 RealFeel® Temperature는 1990년대에 Joel N. Myers, Michael A에 의해 만들어진 최고의 체감온도 지수입니다. RealFeel Temperature는 많은 다른 요소들을 고려한 방정식입니다. 무더위와 추위가 어느 정도인지 판단하기 위해 여러 요인을 고려한 것입니다. 방정식에 사용되는 지표는 습도, 구름 덮개, 바람, 태양 강도, 태양의 각도가 있습니다. 습도는 체감온도를 결정하는 데 큰 기여를 하지만 태양의 각도로 인해 하루의 시간도 중요합니다.",
  Preferences: "환경설정",
  Permission: "위치 권한",
  Enabled: "허용됨",
  Unnabled: "허용 안됨",
  station: "대기오염 측정소",
  Measuringtime: "대기질 축정시간",
  locationtext: "데이터 새로 가져오는중",
  Monday: "월",
  Tuesday: "화",
  Wednesday: "수",
  Thursday: "목",
  Friday: "금",
  Saturday: "토",
  Sunday: "일",
  accurate:
    "GPS로 위치 정보를 가져오는것이 더욱 정확합니다. 스마트폰의 설정에서 앱의 위치정보 사용을 승인 해주세요."
};

i18n.fallbacks = true;
i18n.translations = { ko, en };
i18n.locale = Localization.locale;
console.log(i18n.locale);

const AppContainer = createAppContainer(AppNavigator);

// const navigateAction = NavigationActions.navigate({
//   routeName: "drawerStack",
//   index: 0
// });

// const dayTime = {
//   isDaytimeTrue: {
//     title: "Senset",
//     iconImg: require("./assets/images/icon-sunny-2x.png")
//   },
//   isDaytimeFalse: {
//     title: "Senrise",
//     iconImg: require("./assets/images/icon-sunny-2x.png")
//   }
// };
const airQualityGradient = {
  qualityLevel: {
    good: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 0
    },
    moderate: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 0.1
    },
    unhealtyfor: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 0.3
    },
    unhealty: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 0.5
    },
    veryunhealty: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 0.7
    },
    hazardous: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -1,
      height: 900,
      opacity: 1
    }
  }
};
const isDayTimeGradient = {
  dayTimeTruestyle: {
    true: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -20,
      height: "100%",
      opacity: 0
    },
    false: {
      flex: 1,
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      zIndex: -20,
      height: "100%"
    }
  }
};
const weatherCases = {
  //Sunny
  Sunny: {
    colors: ["#80CBF9", "#EED578", "#FF4B1F"],
    title: "Sunny",
    subtitle: "Go get your ass burnt",
    icon: "weather-sunny",
    iconImg: require("./assets/images/icon-sunny-2x.png"),
    iconImgN: require("./assets/images/icon-clear-n-2x.png"),
    width: 243,
    height: 234,
    widthN: 176, // 밤 가로
    heightN: 244, // 밤 세로
    widthSmall: 74, // 작은것
    heightSmall: 74,
    widthSmallN: 44, // 작은것 밤
    heightSmallN: 60,
    weatherImagemarginBottom: -30
  },

  //Cloud
  Cloud: {
    colors: ["#BEBEBE", "#7C8EB6", "#6F6F6F"],
    title: "Mostly cloudy",
    subtitle: "I know, fucking boring",
    icon: "weather-cloudy",
    iconImg: require("./assets/images/icon-cloud-2x.png"),
    iconImgN: require("./assets/images/icon-cloud-2x.png"),
    width: 264, // 가로
    height: 177, // 세로
    widthN: 264, // 밤 가로
    heightN: 177, // 밤 세로
    widthSmall: 75, // 작은것
    heightSmall: 53,
    widthSmallN: 75, // 작은것 밤
    heightSmallN: 56
  },

  //Rain
  Rain: {
    colors: ["#3E92F1", "#23CE95", "#B8E16F"],
    title: "Rain",
    subtitle: "Go get your ass burnt",
    icon: "weather-sunny",
    iconImg: require("./assets/images/icon-rain-small-2x.png"),
    iconImgN: require("./assets/images/icon-rain-small-n-2x.png"),
    width: 242,
    height: 182,
    widthN: 242, // 밤 가로
    heightN: 182, // 밤 세로
    widthSmall: 79, // 작은것
    heightSmall: 58,
    widthSmallN: 79, // 작은것 밤
    heightSmallN: 58,
    weatherImagemarginBottom: -30
  },

  //Snow
  Snow: {
    colors: ["#E1E1E1", "#9DC0CF", "#A5AAFF"],
    title: "Snow",
    subtitle: "I know, fucking boring",
    icon: "weather-cloudy",
    iconImg: require("./assets/images/icon-snow-2x.png"),
    iconImgN: require("./assets/images/icon-snow-night-2x.png"),
    width: 252,
    height: 235,
    widthN: 252,
    heightN: 235,
    widthSmall: 75,
    heightSmall: 69,
    widthSmallN: 75,
    heightSmallN: 69,
    weatherImagemarginBottom: -20
  },

  //Tstorm
  Thunderstorm: {
    colors: ["#402B43", "#831313", "#2A2424"],
    title: "Thunderstorm",
    subtitle: "Go get your ass burnt",
    icon: "weather-sunny",
    iconImg: require("./assets/images/icon-thunderstorm-2x.png"),
    iconImgN: require("./assets/images/icon-thunderstorm-n-2x.png"),
    width: 250,
    height: 159,
    widthN: 250, // 밤 가로
    heightN: 159, // 밤 세로
    widthSmall: 85, // 작은것
    heightSmall: 55,
    widthSmallN: 85, // 작은것 밤
    heightSmallN: 55
    //weatherImagemarginBottom: -30
  }
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      granted: false,
      error: null,
      lat: null,
      long: null,
      isModalVisible: false,
      accuweatherKEY: API_KEY,
      menuOpen: false,
      countryID: null,
      GPSlocationKey: null, //현재 설정된 키
      temperature: null,
      realFeel: null,
      name: null,
      nameLowerCase: null,
      nameFull: null,
      countrytext: null,
      locationtext: null, //현재 설정된 지역 이름
      thenyesterday: null,
      humidity: null,
      cityname: null,
      mtx: null,
      mty: null,
      pmStation: null,
      currentPositionPM25: null,
      currentPositionPM10: null,
      currentPositionN2: null,
      currentPositionCO: null,
      currentPositionS2: null,
      currentPositionO3: null,
      currentPositionPM2524: null,
      currentPositionPM1024: null,
      isDaytime: null,
      aqi: null,
      PM25currentAqi: null,
      PM25currentAqiLevel: null,
      PM10currentAqi: null,
      PM10currentAqiLevel: null,
      AQIResult: null,
      polutionStandard: null,
      AQILevelResult: null,
      gradientColors: null,
      weatherImageWidth: null,
      weatherImageHeight: null,
      weatherImageWidthSmall: null,
      weatherImageHeightSmall: null,
      weatherImagemarginBottom: null,
      thenYesterdayCompare: null,
      sunLabel: null,
      sunLabelRiseTime: null,
      sunLabelSetTime: null,
      sunLabelTime: null,
      windSpeed: null,
      windUnit: null,
      isDayTimeGradientsTate: null,
      timeStyle: null,
      aqGradient: null,
      fontLoaded: false,
      deviceLocale: null,
      savedLocations: null, // 저장된 키들
      savedLocationsList: null,
      weatherCasesObject: null,
      currentLoc: null, // 기본 키 값
      GPSCountryName: null,
      GPSCityName: null,
      GPSLocalizedName: null,
      defaultLocation: null, //this._setDefaultLocation
      _setDefaultLocation: this._setDefaultLocation,
      _setSettingValue: this._setSettingValue,
      loadingText: "Start Loading",
      setTemp: "0",
      setSpeed: null,
      setPre: null,
      appState: AppState.currentState,
      settingcDUpdate: null,
      locationcDUpdate: null,
      _callCDUbySetting: this._callCDUbySetting,
      _callCDUbyLocation: this._callCDUbyLocation,
      dataLoadScreen: "none",
      hourlyTime: null,
      hourlyWeather: null,
      hourlyWindSpeed: null,
      hourlyWindUnit: null,
      hourlyTemperature: null,
      hourlyReal: null,
      dailyWeathers: [],
      weatherImage: null,
      //weatherSmallImage: this.state.weatherCases,
      weatherText: [],
      dailyHeadline: null,
      currentGPS: null,
      weatherCategory: null,
      grantLocation: null,
      grantbtn: this._getGrantBtn,
      granted: null,
      grantedTXT: null,
      stationName: null,
      calrTime: null,
      grantedInitial: null,
      aqStationTime: null,
      todateday: null
      //initialScreen: "Temp"
      //settingcDUpdateContext:this._callCDUbySetting
    };
  }

  _removeLocation = async () => {
    await AsyncStorage.removeItem("LocationKeys");
    await AsyncStorage.removeItem("currentLocation");
    await AsyncStorage.removeItem("currentGPS");
    await AsyncStorage.removeItem("setTemp");
    console.log("clear all data");
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log("cDU 변경");
    if (
      prevState.defaultLocation !== this.state.defaultLocation &&
      this.state.locationcDUpdate === 1
    ) {
      console.log("지역이 변경되었음");
      this._loadLocations(); // api fetch 함수
      this.setState({
        locationtext: i18n.t("locationtext")
      });
    }
    if (
      prevState.setTemp !== this.state.setTemp &&
      this.state.settingcDUpdate === 1
    ) {
      console.log("세팅값이 변경되었음");
      this._loadLocations(); // api fetch 함수
    }
  }

  _notgetLocationAsync = () => {
    console.log("denied");
    this._loadLocations();
    console.log("denied");
  };

  async getLocationAsync() {
    const { status: permissionStatus } = await Expo.Permissions.getAsync(
      Expo.Permissions.LOCATION
    );
    console.log("permissionStatus " + permissionStatus);
    //console.log("permissionStatus " + status);

    //undetermined
    //granted

    if (permissionStatus !== "granted") {
      // return (
      //   <View>
      //     <Text>ASD</Text>
      //   </View>
      // )
      console.log("no granted");
      this.setState({
        //fontLoaded: false,
        loadingText: "Location permission",
        granted: false,
        grantedTXT: "by IP Address",
        grantedInitial: "1",
        grantLocation:
          "The location permission is not granted\nand the IP address is used."
      });
      this._loadLocations();
      // alert(
      //   "Grant Permission",
      //   "App needs location access to abc.",
      //   [
      //     {
      //       text: "Cancel",
      //       onPress: () => console.log("Cancel Pressed"),
      //       style: "cancel"
      //     },
      //     {
      //       text: "OK",
      //       onPress: async () => {
      //         const { status } = await Expo.Permissions.askAsync(
      //           Expo.Permissions.LOCATION
      //         );
      //         if (status === "granted") {
      //           const locatio = await Expo.Location.watchPositionAsync(
      //             { enableHighAccuracy: true },
      //             callback
      //           );
      //           return locatio;
      //         } else {
      //           alert("Please Turn On your Device GPS");
      //         }
      //       }
      //     }
      //   ],
      //   { cancelable: false }
      // );
      //this.getLocationAsync();
    } else {
      console.log("granted permission");
      this.setState({
        granted: true,
        grantedTXT: "by GPS",
        grantedInitial: "0",
        grantbtn: false,
        grantLocation: "You grant the location permission."
      });
      this._loadLocations();
    }
  }

  _getdate = () => {
    today = new Date();
    week = new Array(
      i18n.t("Sunday"),
      i18n.t("Monday"),
      i18n.t("Tuesday"),
      i18n.t("Wednesday"),
      i18n.t("Thursday"),
      i18n.t("Friday"),
      i18n.t("Saturday")
    );
    this.setState({
      todateday: week[today.getDay()]
    });
  };

  _firebase = () => {
    firebase.initializeApp = {
      apiKey: "AIzaSyAIj24nkV5CRFe-9QIzBPz96L6oQ0X8gJk",
      authDomain: "api-6908354807258023543-445984.firebaseapp.com",
      databaseURL: "https://api-6908354807258023543-445984.firebaseio.com",
      projectId: "api-6908354807258023543-445984",
      storageBucket: "",
      messagingSenderId: "810194407762",
      appId: "1:810194407762:web:eab9597751bc6256"
    };
  };

  async componentDidMount() {
    this._firebase();

    // var offset = new Date().getTimezoneOffset();
    // console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    this.backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      this._handleBackPress
    );

    this._getdate();

    // await firebase.analytics().setCurrentScreen("GiveGithubStarsScreen");
    //firebase.analytics();

    await Font.loadAsync({
      NanumSquareRoundEB: require("./assets/fonts/NanumSquareRoundEB.ttf")
    }).then(() => {
      this.setState({
        fontLoaded: false,
        loadingText: "Load Font"
      });
      console.log("font load : " + this.state.fontLoaded);
    });

    //this.getLocationAsync();

    console.log(this.state.setTemp + "현재 유닛");
    AppState.addEventListener("change", this._handleAppStateChange);
    //console.log(AppContainer);
    //console.log("font load : " + this.state.fontLoaded);

    this.setState({
      deviceLocale: i18n.locale
    });

    this.navigator &&
      this.navigator.dispatch(NavigationActions.navigate({ routeName: Aq }));

    //console.log("aaaaaa" + NavigationActions.navigate);
    //this.navigator.navigate("Setting");
    //console.log("device locale is " + this.state.deviceLocale);

    console.log("askljhdaskljdaklsdlkjasdkljasdkljasdlkasjlkjd");

    if (this.state.deviceLocale === "ko-KR") {
      this.setState({
        deviceLocale: "ko-kr"
      });
    } else {
      this.setState({
        deviceLocale: "en-us"
      });
    }
    //console.log("device locale is " + this.state.deviceLocale);
    //this._getGeo();
    this._loadLocations();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  _handleBackPress = () => {
    if (this.counterAppExit === 1) {
      return false;
    }
    this.counterAppExit = 1;
    ToastAndroid.show(
      "뒤로가기를 두 번 누르면 종료 됩니다.",
      ToastAndroid.SHORT
    );
    setTimeout(() => {
      this.counterAppExit = 0;
    }, 1000);
    return true; // Do not exit app
  };
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this._loadLocations();
      this.setState({
        locationtext: i18n.t("locationtext")
      });
      console.log("App has come to the foreground!");
    }
    this.setState({ appState: nextAppState });
  };

  _loadLocations = async () => {
    console.log("Load Location Start");

    //this.setState({ isLoaded: false });
    //this._loadInitial();
    try {
      const savedLocations = await AsyncStorage.getItem("LocationKeys");
      const savedCurrent = await AsyncStorage.getItem("currentLocation");
      const currentGPS = await AsyncStorage.getItem("currentGPS");
      this.setState({
        savedLocations: JSON.parse(savedLocations),
        //savedLocationleng: JSON.parse(savedLocations).length,
        currentLoc: savedCurrent,
        currentGPS: currentGPS
      });
      console.log("currentGPS? " + this.state.currentGPS);
      //console.log("저장된 지역 키 : " + this.state.savedLocations);
      //console.log("저장된 지역의 수 : " + this.state.savedLocationleng);
      //console.log("디폴트로 지정된 키 : " + this.state.currentLoc);
    } catch (err) {
      console.log("error");
      console.log(err);
    }
    this._getSetting();
    //this._getGeo();
  };

  _calldataLoadScreenShow = () => {
    this.setState({
      dataLoadScreen: "flex"
    });
  };
  _calldataLoadScreenHide = () => {
    this.setState({
      dataLoadScreen: "none"
    });
  };
  _callCDUbySetting = () => {
    this.setState({
      settingcDUpdate: 1
    });
  };

  _callCDUbyLocation = () => {
    this.setState({
      locationcDUpdate: 1
    });
  };

  _getSetting = async () => {
    try {
      const setTemp = await AsyncStorage.getItem("setTemp");
      if (setTemp === "M") {
        this.setState({
          setTemp: "0",
          loadingText: "Get Setting Data / M"
        });
      } else if (setTemp === "I") {
        this.setState({
          setTemp: "1",
          loadingText: "Get Setting Data / I"
        });
      } else if (setTemp === null) {
        this.setState({
          setTemp: "0",
          loadingText: "Get Setting Data / I"
        });
      }
      console.log(this.state.setTemp + "현재 유닛");
      //console.log("현재 설정값" + this.state.setTemp);
    } catch (err) {}
    this._getGeo();
  };

  _getGeo = () => {
    console.log("get geo start");
    this.setState({
      loadingText: "Get latitude, longitude"
      //granted: true
      //grantLocation: "You grant the location permission."
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          granted: true,
          grantedTXT: "by GPS",
          grantedInitial: "0",
          grantLocation: "You grant the location permission."
        });
        //this._getWeather(position.coords.latitude, position.coords.longitude);
        ///console.log("leng" + leng);
        //console.log(position);
        this
          ._getKeybyGPS
          //position.coords.latitude, position.coords.longitude
          ();
      },
      error => {
        // this.setState({
        //   error: error
        // });
        this._getIP();
        console.log("no GPS" + this.state.error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 2000
      } //for fucking android
    );
  };

  _getIP = () => {
    console.log("ip로 넘어왔나?");
    publicIP()
      .then(ip => {
        //console.log(ip);
        // '47.122.71.234'
        return fetch(
          `https://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${API_KEY}&details=true&language=` +
            this.state.deviceLocale +
            "&q" +
            ip
        );
      })
      .then(response => response.json())
      .then(byIPData => {
        //console.log(byIPData);
        this.setState({
          lat: byIPData.GeoPosition.Latitude,
          long: byIPData.GeoPosition.Longitude,
          grantedTXT: "by IP Address",
          granted: false,
          grantedInitial: "1",
          grantLocation:
            "The location permission is not granted\nand the IP address is used."
        });
        this
          ._getKeybyGPS
          //position.coords.latitude, position.coords.longitude
          ();
        //console.log(this.state.lat + this.state.long);
      })
      .catch(error => {
        console.log(error);
        // 'Unable to get IP address.'
      });

    // if (this.state.granted === false) {
    //   publicIP()
    //     .then(ip => {
    //       //console.log(ip);
    //       // '47.122.71.234'
    //       return fetch(
    //         `https://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${API_KEY}&details=true&language=` +
    //           this.state.deviceLocale +
    //           "&q" +
    //           ip
    //       );
    //     })
    //     .then(response => response.json())
    //     .then(byIPData => {
    //       //console.log(byIPData);
    //       this.setState({
    //         lat: byIPData.GeoPosition.Latitude,
    //         long: byIPData.GeoPosition.Longitude
    //       });
    //       this
    //         ._getKeybyGPS
    //         //position.coords.latitude, position.coords.longitude
    //         ();
    //       //console.log(this.state.lat + this.state.long);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //       // 'Unable to get IP address.'
    //     });
    // } else {
    //   console.log("Start by IP Address");
    // }
  };

  _regetGeo = () => {
    console.log("get geo start");
    this.setState({
      loadingText: "Get latitude, longitude"
    });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
        //this._getWeather(position.coords.latitude, position.coords.longitude);
        ///console.log("leng" + leng);
        console.log(position);
        this
          ._getKeybyGPS
          //position.coords.latitude, position.coords.longitude
          ();
      },
      error => {
        this.setState({
          error: error
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 } //for fucking android
    );
    this.componentDidMount();
  };

  _getKeybyGPS = () =>
    //lat, long

    {
      this.setState({
        loadingText: "Get Location Data"
      });
      console.log("getKeybyGPS Func start");
      //console.log(lat, long);
      fetch(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=` +
          this.state.lat +
          `,` +
          this.state.long +
          `&language=` +
          this.state.deviceLocale
      )
        .then(response => response.json())
        .then(location => {
          //console.log(location);
          this.setState({
            GPSlocationKey: location.Key,
            GPSCountryName: location.Country.LocalizedName,
            GPSCityName: location.AdministrativeArea.LocalizedName,
            GPSLocalizedName: location.LocalizedName
          });
          console.log("쿼리 몇 번이나 하냐");
          //console.log("1. 키는?" + this.state.GPSlocationKey);
          console.log("anjf " + JSON.parse(this.state.currentLoc));

          if (this.state.savedLocations === null) {
            console.log("저장된 값이 없으니까 gps기반이다.");
            this.setState({
              defaultLocation: this.state.GPSlocationKey
            });
            console.log("참조할 지역 키 값은 : " + this.state.defaultLocation);
          } else if (this.state.currentGPS === "1") {
            console.log(
              "저장된 값이 있다. 그래도 gps key는 저장한다. 그리고 기본 키가 gps 기반이다."
            );
            this.setState({
              defaultLocation: this.state.GPSlocationKey
            });
            console.log("참조할 지역 키 값은 : " + this.state.defaultLocation);
          } else if (this.state.currentGPS === "0") {
            console.log(
              "저장된 값이 있다. 그래도 gps key는 저장한다. 그리고 기본 키가 저장된 지역이다."
            );
            this.setState({
              defaultLocation: JSON.parse(this.state.currentLoc)
            });
            console.log("참조할 지역 키 값은 : " + this.state.defaultLocation);
            console.log(
              "저장된 지역 중 어떤 키를 가져왔나 : " + this.state.currentLoc
            );
          }

          console.log("saved location " + this.state.savedLocations);
          console.log("currentLoc " + this.state.currentLoc);
          console.log("gps location " + this.state.GPSlocationKey);
          console.log("defaultLocation " + this.state.defaultLocation);
          this._setDefaultLocation(this.state.defaultLocation);

          // lat,
          // long
        });
    };

  _setDefaultLocation = locationKey => {
    console.log("call _setDefaultLocation function");
    this.setState({ defaultLocation: locationKey });
    console.log("지금 디톨트 로케이션은? " + this.state.defaultLocation);
    this._getCurrent(locationKey);
  };

  _getCurrent = (
    locationKey //, lat, long
  ) => {
    console.log("2. 키는?" + locationKey);
    console.log("gps lat : " + this.state.lat);
    console.log("gps long : " + this.state.long);
    fetch(
      `https://dataservice.accuweather.com/locations/v1/` +
        locationKey +
        `?apikey=${API_KEY}&details=true&language=` +
        this.state.deviceLocale
    )
      .then(response => response.json())

      .then(locationbyKey => {
        //console.log(locationbyKey);
        this.setState({
          countrytext: locationbyKey.Country.LocalizedName,
          //countryID: locationbyKey[0].Country.ID,
          locationtext: locationbyKey.LocalizedName,
          cityname: locationbyKey.AdministrativeArea.LocalizedName
        });
        if (this.state.currentGPS === "0") {
          this.setState({
            lat: locationbyKey.GeoPosition.Latitude,
            long: locationbyKey.GeoPosition.Longitude
          });
        }
        // if (this.state.currentGPS === "1") {
        //   console.log("지금은 gps 기반의 지역이다.");
        //   this.setState({
        //     locationtext: this.state.GPSLocalizedName
        //   });
        // } else {
        //   console.log("지금은 gps 기반의 지역이 아니다.");
        //   this.setState({
        //     locationtext: this.state.locationtext
        //   });
        // }

        console.log("123");
        console.log("갱신된 lat : " + this.state.lat);
        console.log("갱신된 long : " + this.state.long);
        return fetch(
          `https://dataservice.accuweather.com/currentconditions/v1/` +
            locationKey +
            `?apikey=${API_KEY}&details=true&language=` +
            this.state.deviceLocale
        );
      })
      .then(response => response.json())
      .then(locationData => {
        console.log("weather data");
        //console.log(locationData);

        if (this.state.setTemp === "0") {
          this.setState({
            //setTemp: "0",
            temperature: Math.round(locationData[0].Temperature.Metric.Value),
            realFeel: Math.round(
              locationData[0].RealFeelTemperature.Metric.Value
            ),
            thenyesterday:
              locationData[0].Past24HourTemperatureDeparture.Metric.Value,
            windSpeed: Math.round(
              locationData[0].Wind.Speed.Metric.Value / 3.6
            ),
            windUnit: "m/s"
          });
          console.log("섭씨");
        } else {
          this.setState({
            //setTemp: "1",
            temperature: Math.round(locationData[0].Temperature.Imperial.Value),
            realFeel: Math.round(
              locationData[0].RealFeelTemperature.Imperial.Value
            ),
            thenyesterday:
              locationData[0].Past24HourTemperatureDeparture.Imperial.Value,
            windSpeed: locationData[0].Wind.Speed.Imperial.Value,
            windUnit: locationData[0].Wind.Speed.Imperial.Unit
          });
          console.log("화씨");
        }

        this.setState({
          // temperature: Math.round(locationData[0].Temperature.Metric.Value), // 도씨
          // temperatureF: Math.round(locationData[0].Temperature.Imperial.Value), // 화씨
          name: locationData[0].WeatherText.replace(/\s/gi, ""),
          nameFull: locationData[0].WeatherText,
          nameLowerCase: locationData[0].WeatherText.toLowerCase().replace(
            /\s/gi,
            ""
          ),
          thenyesterday:
            locationData[0].Past24HourTemperatureDeparture.Metric.Value,
          humidity: locationData[0].RelativeHumidity,
          isDaytime: JSON.stringify(locationData[0].IsDayTime),

          weatherCasesObject: weatherCases,
          loadingText: "Get Weather Data"

          // weatherImageWidth:
          //   locationData[0].WeatherText.replace(/\s/gi, "") &&
          //   weatherCases[locationData[0].WeatherText.replace(/\s/gi, "")].width,
          // weatherImageHeight:
          //   locationData[0].WeatherText.replace(/\s/gi, "") &&
          //   weatherCases[locationData[0].WeatherText.replace(/\s/gi, "")]
          //     .height,
          // weatherImageWidthSmall:
          //   locationData[0].WeatherText.replace(/\s/gi, "") &&
          //   weatherCases[locationData[0].WeatherText.replace(/\s/gi, "")]
          //     .widthSmall,
          // weatherImageHeightSmall:
          //   locationData[0].WeatherText.replace(/\s/gi, "") &&
          //   weatherCases[locationData[0].WeatherText.replace(/\s/gi, "")]
          //     .heightSmall
        });
        if (this.state.isDaytime === "true") {
          this.setState({
            isDayTimeGradientsTate: isDayTimeGradient.dayTimeTruestyle.true
          });
        } else {
          this.setState({
            isDayTimeGradientsTate: isDayTimeGradient.dayTimeTruestyle.false
          });
        }
        console.log("날씨 풀네임 : " + this.state.nameFull);
        console.log("날씨 공백 줄임 : " + this.state.name);
        console.log("날씨 공백 줄이고 소문자 : " + this.state.nameLowerCase);
        if (
          this.state.name.includes("눈") ||
          this.state.name.includes("눈발") ||
          this.state.name.includes("우박") ||
          this.state.name.includes("어는") ||
          this.state.name.includes("now") ||
          this.state.name.includes("urri") ||
          this.state.name.includes("eet") ||
          this.state.name.includes("ree")
        ) {
          this.setState({
            weatherCategory: "Snow",
            weatherImagemarginBottom:
              weatherCases.Snow.weatherImagemarginBottom,
            weatherTitle: weatherCases.Snow.title
          });

          if (this.state.isDaytime === "true") {
            this.setState({
              weatherImage: weatherCases.Snow.iconImg,
              weatherImageWidth: weatherCases.Snow.width,
              weatherImageHeight: weatherCases.Snow.height,
              weatherImageWidthSmall: weatherCases.Snow.widthSmall,
              weatherImageHeightSmall: weatherCases.Snow.heightSmall
            });
          } else {
            this.setState({
              weatherImage: weatherCases.Snow.iconImgN,
              weatherImageWidth: weatherCases.Snow.widthN,
              weatherImageHeight: weatherCases.Snow.heightN,
              weatherImageWidthSmall: weatherCases.Snow.widthSmallN,
              weatherImageHeightSmall: weatherCases.Snow.heightSmallN
            });
          }
        }
        if (
          this.state.name.includes("화창") ||
          this.state.name.includes("해") ||
          this.state.name.includes("unny") ||
          this.state.name.includes("ear") ||
          this.state.name.includes("맑음")
        ) {
          this.setState({
            weatherCategory: "Sunny",
            weatherImagemarginBottom:
              weatherCases.Sunny.weatherImagemarginBottom,
            weatherTitle: weatherCases.Sunny.title
          });

          if (this.state.isDaytime === "true") {
            this.setState({
              weatherImage: weatherCases.Sunny.iconImg,
              weatherImageWidth: weatherCases.Sunny.width,
              weatherImageHeight: weatherCases.Sunny.height,
              weatherImageWidthSmall: weatherCases.Sunny.widthSmall,
              weatherImageHeightSmall: weatherCases.Sunny.heightSmall
            });
          } else {
            this.setState({
              weatherImage: weatherCases.Sunny.iconImgN,
              weatherImageWidth: weatherCases.Sunny.widthN,
              weatherImageHeight: weatherCases.Sunny.heightN,
              weatherImageWidthSmall: weatherCases.Sunny.widthSmallN,
              weatherImageHeightSmall: weatherCases.Sunny.heightSmallN
            });
          }
        }
        if (
          this.state.name.includes("비") ||
          this.state.name.includes("소나기") ||
          this.state.name.includes("ain") ||
          this.state.name.includes("ower")
        ) {
          this.setState({
            weatherCategory: "Rain",
            weatherImagemarginBottom:
              weatherCases.Rain.weatherImagemarginBottom,
            weatherTitle: weatherCases.Rain.title
          });

          if (this.state.isDaytime === "true") {
            this.setState({
              weatherImage: weatherCases.Rain.iconImg,
              weatherImageWidth: weatherCases.Rain.width,
              weatherImageHeight: weatherCases.Rain.height,
              weatherImageWidthSmall: weatherCases.Rain.widthSmall,
              weatherImageHeightSmall: weatherCases.Rain.heightSmall
            });
          } else {
            this.setState({
              weatherImage: weatherCases.Rain.iconImgN,
              weatherImageWidth: weatherCases.Rain.widthN,
              weatherImageHeight: weatherCases.Rain.heightN,
              weatherImageWidthSmall: weatherCases.Rain.widthSmallN,
              weatherImageHeightSmall: weatherCases.Rain.heightSmallN
            });
          }
        }
        if (
          this.state.name.includes("흐림") ||
          this.state.name.includes("흐") ||
          this.state.name.includes("구름") ||
          this.state.name.includes("안개") ||
          this.state.name.includes("뿌연") ||
          this.state.name.includes("oud") ||
          this.state.name.includes("ver") ||
          this.state.name.includes("og") ||
          this.state.name.includes("eary") ||
          this.state.name.includes("azy")
        ) {
          this.setState({
            weatherCategory: "Cloud",
            weatherImagemarginBottom:
              weatherCases.Cloud.weatherImagemarginBottom,
            weatherTitle: weatherCases.Cloud.title
          });

          if (this.state.isDaytime === "true") {
            this.setState({
              weatherImage: weatherCases.Cloud.iconImg,
              weatherImageWidth: weatherCases.Cloud.width,
              weatherImageHeight: weatherCases.Cloud.height,
              weatherImageWidthSmall: weatherCases.Cloud.widthSmall,
              weatherImageHeightSmall: weatherCases.Cloud.heightSmall
            });
          } else {
            this.setState({
              weatherImage: weatherCases.Cloud.iconImgN,
              weatherImageWidth: weatherCases.Cloud.widthN,
              weatherImageHeight: weatherCases.Cloud.heightN,
              weatherImageWidthSmall: weatherCases.Cloud.widthSmallN,
              weatherImageHeightSmall: weatherCases.Cloud.heightSmallN
            });
          }
        }
        if (
          this.state.name.includes("뇌우") ||
          this.state.name.includes("orm")
        ) {
          this.setState({
            weatherCategory: "Thunderstorm",
            weatherImagemarginBottom:
              weatherCases.Thunderstorm.weatherImagemarginBottom,
            weatherTitle: weatherCases.Thunderstorm.title
          });

          if (this.state.isDaytime === "true") {
            this.setState({
              weatherImage: weatherCases.Thunderstorm.iconImg,
              weatherImageWidth: weatherCases.Thunderstorm.width,
              weatherImageHeight: weatherCases.Thunderstorm.height,
              weatherImageWidthSmall: weatherCases.Thunderstorm.widthSmall,
              weatherImageHeightSmall: weatherCases.Thunderstorm.heightSmall
            });
          } else {
            this.setState({
              weatherImage: weatherCases.Thunderstorm.iconImgN,
              weatherImageWidth: weatherCases.Thunderstorm.widthN,
              weatherImageHeight: weatherCases.Thunderstorm.heightN,
              weatherImageWidthSmall: weatherCases.Thunderstorm.widthSmallN,
              weatherImageHeightSmall: weatherCases.Thunderstorm.heightSmallN
            });
          }
        }
        // (function(element) {
        //   return locationdelKey.indexOf(element[0]) === -1;
        // })
        // this.setState({
        //   catchLocation: this.state.savedLocations.filter(function(element) {
        //     return locationdelKey.indexOf(element[0]) === -1;
        //   })
        // });

        console.log("devie locale!!!!!!!!!!!!!!!" + this.state.deviceLocale);

        if (this.state.deviceLocale === "ko-kr") {
          if (this.state.thenyesterday === 0) {
            this.setState({
              thenYesterdayCompare: "어제와 온도가 같습니다"
            });
          } else if (this.state.thenyesterday > 0) {
            this.setState({
              thenYesterdayCompare:
                i18n.t("thenYesterday") +
                this.state.thenyesterday +
                "º" +
                i18n.t("thenYesterdayHigher")
            });
          } else if (this.state.thenyesterday < 0) {
            this.setState({
              thenYesterdayCompare:
                i18n.t("thenYesterday") +
                this.state.thenyesterday +
                "º" +
                i18n.t("thenYesterdayLower")
            });
          }
        } else {
          if (this.state.thenyesterday === 0) {
            this.setState({
              thenYesterdayCompare: "Temp is the same as yesterday"
            });
          } else if (this.state.thenyesterday > 0) {
            this.setState({
              thenYesterdayCompare:
                this.state.thenyesterday + "º " + "higher than yesterday"
            });
          } else if (this.state.thenyesterday < 0) {
            this.setState({
              thenYesterdayCompare:
                this.state.thenyesterday + "º " + "lower than yesterday"
            });
          }
        }

        console.log(this.state.isDaytime);
        console.log(this.state.name);
        //console.log(this.state.weatherCasesObject);
        return fetch(
          `https://dataservice.accuweather.com/forecasts/v1/daily/1day/` +
            locationKey +
            `?apikey=${API_KEY}&details=true&language=` +
            this.state.deviceLocale
        );
      })
      //.catch(error => _getWeather())
      .then(response => response.json())
      .then(forecastData => {
        if (forecastData.DailyForecasts[0].Sun.Rise === null) {
          this.setState({
            sunLabelRiseTime: false,
            sunLabelSetTime: false
          });
        } else {
          this.setState({
            sunLabelRiseTime: forecastData.DailyForecasts[0].Sun.Rise,
            sunLabelSetTime: forecastData.DailyForecasts[0].Sun.Set
          });
        }

        if (this.state.isDaytime === "true") {
          //값을 반전시키면 낮 밤 바꿈

          if (this.state.sunLabelSetTime === false) {
            this.setState({
              sunLabelTime: "No Data"
            });
          } else {
            this.setState({
              sunLabelTime: this.state.sunLabelSetTime.substring(11, 16)
            });
          }

          this.setState({
            sunLabel: i18n.t("sunset")
            //sunLabelTime: this.state.sunLabelSetTime.substring(11, 16),
            // isDayTimeGradientsTate: isDayTimeGradient.dayTimeTruestyle.true,
            // weatherImage:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].iconImg,
            // weatherImageWidth:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].width,
            // weatherImageHeight:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].height,
            // weatherImageWidthSmall:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].widthSmall,
            // weatherImageHeightSmall:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].heightSmall,
            // weatherImagemarginBottom:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")]
            //     .weatherImagemarginBottom,
            // weatherTitle:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].title
          });
        } else {
          if (this.state.sunLabelRiseTime === false) {
            this.setState({
              sunLabelTime: "No Data"
            });
          } else {
            this.setState({
              sunLabelTime: this.state.sunLabelRiseTime.substring(11, 16)
            });
          }

          this.setState({
            sunLabel: i18n.t("sunrise"),
            //sunLabelTime: this.state.sunLabelRiseTime.substring(11, 16),
            isDayTimeGradientsTate: isDayTimeGradient.dayTimeTruestyle.false
            // weatherImage:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].iconImgN,
            // weatherImageWidth:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].widthN,
            // weatherImageHeight:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].heightN,
            // weatherImageWidthSmall:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].widthSmallN,
            // weatherImageHeightSmall:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].heightSmallN,
            // weatherImagemarginBottom:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")]
            //     .weatherImagemarginBottom,
            // weatherTitle:
            //   this.state.name.replace(/\s/gi, "") &&
            //   weatherCases[this.state.name.replace(/\s/gi, "")].title
          });
        }

        console.log(air_KEY);
        console.log("start forecast 1day");

        //console.log(forecastData);
        //return fetch(`https://dapi.kakao.com/v2/local/geo/transcoord.json?x=-73.935242&y=40.730610&input_coord=WGS84&output_coord=TM`,{
        //console.log("참조될 lat : " + this.state.lat);
        //console.log("참조될 long : " + this.state.long);
        return fetch(
          `https://api.airvisual.com/v2/nearest_station?lat=` +
            this.state.lat +
            `&lon=` +
            this.state.long +
            `&key=${air_KEY}`
        );
        //api.airvisual.com/v2/nearest_station?lat={{LATITUDE}}&lon={{LONGITUDE}}&key={{YOUR_API_KEY}}
        //console.log(locationData[0].WeatherText);
      })

      .then(response => response.json())
      .then(airData => {
        //console.log(airData);
        console.log("air data" + airData.status);
        console.log("air data city" + airData.data.city);
        console.log("air data country" + airData.data.country);
        //console.log("air polution" + airpolution);
        // if ((airData.data.current.pollution.p1.aqius =null)) {
        //   this.setState({
        //     currentPositionPM25: "no data"
        //   });
        // } else {
        //   this.setState({
        //     currentPositionPM25: airData.data.current.pollution.p1.aqius
        //   });
        // }
        // if (airData.data.current.pollution.p1.aqius == false) {
        //   console.log("undefined");
        // } else {
        //   console.log("derfined");
        // }
        //console.log();

        if (airData.data.current.pollution.o3 === undefined) {
          console.log("data have");
        } else {
          console.log("data dont have");
        }
        var date = new Date();
        var offsetInHours = date.getTimezoneOffset() / -60;
        var datesubstring = date.getHours();
        console.log(offsetInHours);
        console.log(datesubstring);

        this.setState({
          loadingText: "Get Air Polution Data",
          polutionStandard: airData.data.current.pollution.mainus,
          AQILevelResult: airData.data.current.pollution.aqius,
          stationName: airData.data.name,
          calrTime: airData.data.current.pollution.ts.substring(11, 13),
          aqStationTime: datesubstring
          // currentPositionPM10: airData.data.current.pollution.p2.aqius,
          // currentPositionN2: airData.data.current.pollution.n2.aqius,
          // currentPositionCO: airData.data.current.pollution.co.aqius,
          // currentPositionS2: airData.data.current.pollution.s2.aqius,
          // currentPositionO3: airData.data.current.pollution.o3.aqius
        });
        console.log(
          "계산된 시간 " + Number(this.state.calrTime) + Number(offsetInHours)
        );
        if (airData.data.current.pollution.p1 == null) {
          this.setState({
            currentPositionPM10: "0"
          });
        } else {
          this.setState({
            currentPositionPM10: airData.data.current.pollution.p1.aqius
          });
        }

        if (airData.data.current.pollution.p2 == null) {
          this.setState({
            currentPositionPM25: "0"
          });
        } else {
          this.setState({
            currentPositionPM25: airData.data.current.pollution.p2.aqius
          });
        }

        if (airData.data.current.pollution.co == null) {
          this.setState({
            currentPositionCO: "0"
          });
        } else {
          this.setState({
            currentPositionCO: airData.data.current.pollution.co.aqius
          });
        }

        if (airData.data.current.pollution.s2 == null) {
          this.setState({
            currentPositionS2: "0"
          });
        } else {
          this.setState({
            currentPositionS2: airData.data.current.pollution.s2.aqius
          });
        }

        if (airData.data.current.pollution.o3 == null) {
          this.setState({
            currentPositionO3: "0"
          });
        } else {
          this.setState({
            currentPositionO3: airData.data.current.pollution.o3.aqius
          });
        }

        if (airData.data.current.pollution.n2 == null) {
          this.setState({
            currentPositionN2: "0"
          });
        } else {
          this.setState({
            currentPositionN2: airData.data.current.pollution.n2.aqius
          });
        }

        if (airData.data.current.pollution.mainus === "p2") {
          this.setState({
            polutionStandard: "PM 2.5"
          });
        }
        if (airData.data.current.pollution.mainus === "p1") {
          this.setState({
            polutionStandard: "PM 10"
          });
        }

        if (this.state.AQILevelResult < 50) {
          this.setState({
            AQIResult: i18n.t("airqualityGood"),
            aqGradient: airQualityGradient.qualityLevel.good
          });
        } else if (this.state.AQILevelResult < 100) {
          this.setState({
            AQIResult: i18n.t("airqualityModerate"),
            aqGradient: airQualityGradient.qualityLevel.moderate
            //isLoaded: true
          });
        } else if (this.state.AQILevelResult < 150) {
          this.setState({
            AQIResult: i18n.t("airqualityUnfor"),
            aqGradient: airQualityGradient.qualityLevel.unhealtyfor
          });
        } else if (this.state.AQILevelResult < 200) {
          this.setState({
            AQIResult: i18n.t("airqualityUnhealthy"),
            aqGradient: airQualityGradient.qualityLevel.unhealty
          });
        } else if (this.state.AQILevelResult < 300) {
          this.setState({
            AQIResult: i18n.t("airqualityVUnhealthy"),
            aqGradient: airQualityGradient.qualityLevel.veryunhealty
          });
        } else if (this.state.AQILevelResult < 400) {
          this.setState({
            AQIResult: i18n.t("airqualityHazardous"),
            aqGradient: airQualityGradient.qualityLevel.hazardous
          });
        } else if (this.state.AQILevelResult < 500) {
          this.setState({
            AQIResult: i18n.t("airqualityHazardous2"),
            aqGradient: airQualityGradient.qualityLevel.hazardous
          });
        }
        console.log("PM10 : " + this.state.currentPositionPM10);
        console.log("AQI : " + this.state.AQILevelResult);
        console.log("AQI Level : " + this.state.AQIResult);
      });

    this._getDaily();
  };

  _getDaily = () => {
    if (this.state.setTemp === "0") {
      fetch(
        `https://dataservice.accuweather.com//forecasts/v1/hourly/12hour/` +
          this.state.defaultLocation +
          `?apikey=` +
          this.state.accuweatherKEY +
          `&details=true&metric=true&language=` +
          this.state.deviceLocale
      )
        .then(response => response.json())
        .then(hourly => {
          //console.log(hourly);
          this.setState({
            hourlyWeathers: hourly
          });
          return fetch(
            `https://dataservice.accuweather.com/forecasts/v1/daily/5day/` +
              this.state.defaultLocation +
              `?apikey=` +
              this.state.accuweatherKEY +
              `&details=true&metric=true&language=` +
              this.state.deviceLocale
          )
            .then(response => response.json())
            .then(daily => {
              console.log("daily data001" + daily);
              this.setState({
                dailyWeathers: daily.DailyForecasts,
                dailyHeadline: daily.Headline.Text,
                isLoaded: true
              });
            });
        });
    } else {
      fetch(
        `https://dataservice.accuweather.com//forecasts/v1/hourly/12hour/` +
          this.state.defaultLocation +
          `?apikey=` +
          this.state.accuweatherKEY +
          `&details=true&metric=false&language=` +
          this.state.deviceLocale
      )
        .then(response => response.json())
        .then(hourly => {
          //console.log(hourly);
          console.log("hourly data002");
          this.setState({
            hourlyWeathers: hourly
            //weatherImage: hourly[0].IconPhrase
            // weatherImage:
            // hourly[0].WeatherText.replace(/\s/gi, "") &&
            //   weatherCases[locationData[0].WeatherText.replace(/\s/gi, "")]
            //     .iconImg
            // // hourlyTime: hourly.DateTime,
            //hourlyWeather: [hourly].
            // hourlyWindSpeed: hourly.Wind.Speed.Value,
            // hourlyWindUnit: hourly.Wind.Speed.Unit
            // // hourlyTemperature: hourly.Temperature.Value,
            // // hourlyReal: hourly.RealFeelTemperature.Value
          });
          return fetch(
            `https://dataservice.accuweather.com/forecasts/v1/daily/5day/` +
              this.state.defaultLocation +
              `?apikey=` +
              this.state.accuweatherKEY +
              `&details=true&metric=false&language=` +
              this.state.deviceLocale
          )
            .then(response => response.json())
            .then(daily => {
              console.log("daily data002");
              this.setState({
                dailyWeathers: daily.DailyForecasts,
                dailyHeadline: daily.Headline.Text,
                isLoaded: true
              });
            });
        });
    }
    console.log("current lat" + this.state.lat);
    console.log("current long" + this.state.long);
    // this.setState({
    //   isLoaded: true
    // });
  };

  _setSettingValue = settingValue => {
    console.log("call _setDefaultLocation function");
    this.setState({ setTemp: settingValue });
    console.log(this.state.setTemp);
    //this._getKeybyGPS();
  };

  _getGrantBtn = () => {
    return (
      <TouchableOpacity style={styles.buttonss} onPress={this._getAppUrl}>
        <Text
          style={{
            color: "#fff",
            fontSize: 15,
            fontFamily: "NanumSquareRoundEB"
          }}
        >
          {i18n.t("getprobtn")}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    //firebase.analytics().setCurrentScreen("HOME");
    //console.log("!!!!", this.props);
    //console.log(initialscreen);
    //console.log("APP.js" + this.props);

    const {
      isLoaded,
      granted,
      error,
      isDaytime,
      temperature,
      realFeel,
      name,
      countrytext,
      locationtext,
      thenyesterday,
      humidity,
      cityname,
      currentPositionPM10,
      currentPositionPM25
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {isLoaded ? (
          <LinearGradient
            //colors={weatherCases[this.state.name].colors}
            colors={
              this.state.weatherCategory
                ? weatherCases[this.state.weatherCategory].colors
                : ["#000000", "#111111"]
            }
            //colors={'["' + this.state.gradientColors[0] + '","' + this.state.gradientColors[1] + '","' + this.state.gradientColors[2] + '"]'}
            //colors={["#000000", "#111111"]}
            style={{ flex: 1, opacity: 1 }}
            start={[0.6, 0]}
            end={[0.3, 0.9]}
            //locations={[0.0, 0.6 ,1.0]}
          >
            <WeatherContext.Provider value={this.state}>
              <AppContainer
                ref={nav => {
                  this.navigator = nav;
                }}
              />
            </WeatherContext.Provider>
            {/* <Text>{this.state.grantedTXT}</Text> */}
            {/* <TouchableOpacity onPress={this._removeLocation}>
              <Text>reset data</Text>
            </TouchableOpacity> */}
          </LinearGradient>
        ) : (
          <View style={styles.loading}>
            <View style={styles.loadingUpper}>
              <Image
                source={require("./assets/images/logo-loading-2x.png")}
                style={{ width: 324, height: 324, marginBottom: -100 }}
              />
            </View>
            <View style={styles.loadingLower}>
              <Text style={styles.loadingdivider}>...</Text>
              {/* <TouchableOpacity onPress={this._removeLocation}>
                <Text>reset data</Text>
              </TouchableOpacity> */}

              <Text style={styles.loadingText}>{this.state.loadingText}</Text>
              <Text style={styles.loadingSubText}>
                {this.state.grantLocation}
              </Text>

              {/* {this.state.granted ? (
                <Text style={styles.loadingSubText}>
                  {this.state.grantLocation}
                </Text>
              ) : (
                <View>
                  <Text style={styles.loadingSubText}>
                    {this.state.grantLocation}
                  </Text>
                  <TouchableOpacity
                    style={styles.buttonss}
                    onPress={this._notgetLocationAsync}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 15
                      }}
                    >
                      Refresh
                    </Text>
                  </TouchableOpacity>
                </View>
              )} */}
            </View>
            <View style={styles.loadbottom}>
              <Text>{this.state.error}</Text>
              <Text
                style={{ fontSize: 11, textAlign: "center", color: "#8E8E8E" }}
              >
                v1.0.20{"\n"}Copyright 2019 Heebean Creative
              </Text>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerRouter: {
    flex: 1
  },
  loadbottom: {
    alignItems: "center",
    ...ifIphoneX(
      {
        paddingBottom: 25 //iphone x style
      },
      {
        paddingBottom: 15 // default style
      }
    ),
    ...Platform.select({
      android: {
        paddingBottom: 15
      }
    })
  },
  linear: {
    flex: 1
  },
  loadingUpper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  loadingLower: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  loading: {
    flex: 1,
    justifyContent: "flex-end",
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 1000
  },
  loadingdivider: {
    //fontFamily: "NanumSquareRoundEB",
    fontSize: 34,
    color: "#B9B9B9",
    paddingVertical: 35
  },
  loadingText: {
    //fontFamily: "NanumSquareRoundEB",
    fontSize: 29,
    color: "#656565"
  },
  loadingSubText: {
    //fontFamily: "NanumSquareRoundEB",
    textAlign: "center",
    fontSize: 12,
    color: "#B9B9B9"
  },
  buttonss: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    color: "#fff",
    backgroundColor: "#373737",
    alignSelf: "center",
    //fontFamily: "NanumSquareRoundEB",
    marginTop: 25
  }
});
