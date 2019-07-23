import React from "react";
import {
  ScrollView,
  SafeAreaView,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Dimensions,
  WebView,
  AsyncStorage,
  Linking
} from "react-native";
import { Constants, WebBrowser } from "expo";
import {
  createStackNavigator,
  createDrawerNavigator,
  DrawerItems,
  createAppContainer
} from "react-navigation";
import Colors from "../constants/Colors";
//import TabsNavigator from './MainTabsNavigator';
import { WeatherContext } from "../Context";

import TempScreen from "../screens/Temp";
import AqScreen from "../screens/Aq";
import PrecipScreen from "../screens/Precip";
import SettingScreen from "../screens/Setting";
import AddLocationScreen from "../screens/AddLocation";
import SkyScreen from "../screens/Sky";
import AlarmScreen from "../screens/Alarm";
import Location from "./../location";
import { DrawerActions } from "react-navigation-drawer";
import i18n from "i18n-js";
import { Localization } from "expo-localization";

const en = {
  menuTemp: "Temperature",
  menuAQ: "Air Quality",
  menuPre: "Precipitation",
  menuSky: "Sky",
  menuAlarm: "Alarm",
  menuSetting: "Setting",
  addLocation: "Add Location"
};
const ko = {
  menuTemp: "온도",
  menuAQ: "대기질",
  menuPre: "강수량, 눈",
  menuSky: "하늘",
  menuAlarm: "알람",
  menuSetting: "설정",
  addLocation: "지역 추가"
};

//console.log("APP CONTAINER" + JSON.stringify(WeatherContext));
//console.log("APP CONTAINER" + this.props);
// const obj = WeatherContext;
// Object.Keys(obj).map(key => console.log(obj.key));
// export class AppContainer extends React.Component {
//   componentDidMount = () => {
//     console.log("import App Container");
//   };
//   async componentDidMount() {
//     console.log("import App Containerasd");
//   }
// }

_handleOpenWithWebBrowser = () => {
  WebBrowser.openBrowserAsync(
    "https://academy.nomadcoders.co/?utm_source=WhatTheWeather-App"
  );
};

this.state = {
  deviceLocale: null,
  initialScreen: "Temp"
  //propsContainer: this[0]
};

// if ("a" === "a") {
//   console.log("IF what the fuck initial screen " + this.state.initialScreen);
//   _loadInitial = async () => {
//     console.log(
//       "async what the fuck initial screen " + this.state.initialScreen
//     );
//     try {
//       const savedInitial = await AsyncStorage.getItem("initialScreen");
//       this.setState({
//         initialScreen: savedInitial
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };
// }

_loadInitial = async () => {
  console.log("async what the fuck initial screen " + this.state.initialScreen);
  try {
    const savedInitial = await AsyncStorage.getItem("initialScreen");
    this.setState({
      initialScreen: savedInitial
    });
  } catch (err) {
    console.log(err);
  }
};

// const AppNavigator = createSwitchNavigator(
//   {
//     AuthChecking: AuthCheckingScreen,
//     App: { screen: AppDrawer },
//     Auth: { screen: AuthStack }
//   },
//   {
//     initialRouteName: _loadInitial()
//   }
// );

i18n.fallbacks = true;
i18n.translations = { ko, en };
i18n.locale = Localization.locale;
//console.log(i18n.locale);
//console.log("props" + this.state.propsContainer);
//console.log("props1" + this.navigator);

//console.log("from location" + TempScreen);
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

const TempStack = createStackNavigator(
  //_loadInitial(),

  {
    Temp: TempScreen
  },

  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerTintColor: "#000",
      cardStyle: {
        backgroundColor: "black"
      },
      headerStyle: {
        backgroundColor: "transparent",
        zIndex: 10,
        width: 50
      },

      headerTransparent: "true",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.callLeftmenu}
            source={require("./../assets/images/hamburger-2x.png")}
          />
        </TouchableOpacity>
      )
    })
  }
);

const AqStack = createStackNavigator(
  {
    Aq: AqScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerTintColor: "#000",
      headerStyle: {
        backgroundColor: "transparent",
        zIndex: 10,
        width: 50
      },

      headerTransparent: "true",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.callLeftmenu}
            source={require("./../assets/images/hamburger-2x.png")}
          />
        </TouchableOpacity>
      )
    })
  }
);

const PrecipStack = createStackNavigator(
  {
    Precip: PrecipScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerTintColor: "#000",
      headerStyle: {
        backgroundColor: "transparent",
        zIndex: 10,
        width: 50
      },

      headerTransparent: "true",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.callLeftmenu}
            source={require("./../assets/images/hamburger-2x.png")}
          />
        </TouchableOpacity>
      )
    })
  }
);
const SkyStack = createStackNavigator(
  {
    Sky: SkyScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerTintColor: "#000",
      headerStyle: {
        backgroundColor: "transparent",
        zIndex: 10,
        width: 50
      },

      headerTransparent: "true",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            style={styles.callLeftmenu}
            source={require("./../assets/images/hamburger-2x.png")}
          />
        </TouchableOpacity>
      )
    })
  }
);
// const AlarmStack = createStackNavigator(
//   {
//     Alarm: AlarmScreen
//   },
//   {
//     defaultNavigationOptions: ({ navigation }) => ({
//       headerTintColor: "#000",
//       headerStyle: {
//         backgroundColor: "transparent",
//         zIndex: 10,
//         width: 50
//       },

//       headerTransparent: "true",
//       headerLeft: (
//         <TouchableOpacity
//           onPress={() => {
//             navigation.toggleDrawer();
//           }}
//         >
//           <Image
//             style={styles.callLeftmenu}
//             source={require("./../assets/images/hamburger-2x.png")}
//           />
//         </TouchableOpacity>
//       )
//     })
//   }
// );
const SettingStack = createStackNavigator({
  Setting: {
    screen: SettingScreen,
    headerMode: "none",
    navigationOptions: ({ navigation }) => ({
      headerTitleStyle: {
        fontSize: 25,
        color: "#373737",
        fontFamily: "NanumSquareRoundEB",
        marginTop: 63,
        textAlign: "center",
        alignSelf: "center",
        flex: 1
      },
      headerStyle: {
        height: 125,
        zIndex: 1500,
        width: "100%"
        //backgroundColor: "red"
      },
      title: i18n.t("menuSetting"),
      headerTransparent: true,
      // headerBackImage: (
      //   <Image
      //     style={{ width: 29, height: 27 }}
      //     source={require("../assets/images/icon-menu-aq-2x.png")}
      //   />
      // ),
      headerTruncatedBackTitle: "goback",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Image
            style={{ width: 24, height: 20, marginLeft: 50 }}
            source={require("./../assets/images/icon-page-call-left-2x.png")}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={{ width: 74, height: 20 }}>
          {/* <Image
            style={{ width: 24, height: 20, marginRight: 50 }}
            source={require("./../assets/images/icon-page-call-left-2x.png")}
          /> */}
        </View>
      )
    })
  },
  AddLocation: {
    screen: AddLocationScreen,
    navigationOptions: ({ navigation }) => ({
      headerTransparent: true,
      title: i18n.t("addLocation"),
      headerTitleStyle: {
        fontSize: 25,
        color: "#373737",
        fontFamily: "NanumSquareRoundEB",
        marginTop: 63,
        textAlign: "center",
        alignSelf: "center",
        flex: 1
      },
      headerStyle: {
        height: 125,
        width: "100%"
      },
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          //onDidFocus={payload => console.log("will focus", payload)}
        >
          <Image
            source={require("../assets/images/icon-header-back-2x.png")}
            style={{ width: 13, height: 23, marginLeft: 50 }}
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <View style={{ width: 74, height: 20 }}>
          {/* <Image
            style={{ width: 24, height: 20, marginRight: 50 }}
            source={require("./../assets/images/icon-page-call-left-2x.png")}
          /> */}
        </View>
      )
    })
  }
});

const DrawerNavigator = createDrawerNavigator(
  {
    //TabsNavigator: { screen: MainTabsNavigator },
    Temp: {
      screen: TempStack,
      cardStyle: {
        backgroundColor: "transparent"
      },
      navigationOptions: {
        drawerLabel: i18n.t("menuTemp"),
        drawerIcon: (
          <Image
            style={{ width: 16, height: 30 }}
            source={require("../assets/images/icon-menu-temp-2x.png")}
          />
        )
      }
    },

    Aq: {
      screen: AqStack,
      navigationOptions: {
        drawerLabel: i18n.t("menuAQ"),
        drawerIcon: (
          <Image
            style={{ width: 29, height: 27 }}
            source={require("../assets/images/icon-menu-aq-2x.png")}
          />
        )
      }
    },
    Precip: {
      screen: PrecipStack,
      navigationOptions: {
        drawerLabel: i18n.t("menuPre"),
        drawerIcon: (
          <Image
            style={{ width: 21, height: 23 }}
            source={require("../assets/images/icon-menu-recip-2x.png")}
          />
        )
      }
    },
    Sky: {
      screen: SkyStack,
      navigationOptions: {
        drawerLabel: i18n.t("menuSky"),
        drawerIcon: (
          <Image
            style={{ width: 23, height: 23 }}
            source={require("../assets/images/icon-menu-sky-2x.png")}
          />
        )
      }
    },
    // Alarm: {
    //   screen: AlarmStack,
    //   navigationOptions: {
    //     drawerLabel: i18n.t("menuAlarm"),
    //     drawerIcon: (
    //       <Image
    //         style={{ width: 25, height: 30 }}
    //         source={require("../assets/images/icon-menu-alarm-2x.png")}
    //       />
    //     )
    //   }
    // },
    Setting: {
      screen: SettingStack,
      navigationOptions: {
        drawerLabel: i18n.t("menuSetting"),
        drawerIcon: (
          <Image
            style={{ width: 26, height: 26 }}
            source={require("../assets/images/icon-menu-setting-2x.png")}
          />
        )
      }
    }
  },

  {
    contentComponent: props => (
      <ScrollView style={{ flex: 1 }}>
        <SafeAreaView style={{ height: deviceHeight }}>
          <DrawerItems {...props} />
        </SafeAreaView>
        <View
          style={{
            position: "absolute",
            bottom: 25,
            paddingLeft: 20,
            paddingRight: 20,
            width: 200,
            flexDirection: "row"
          }}
        >
          <Image
            style={{ width: 32, height: 25 }}
            source={require("../assets/images/icon-nomad-2x.png")}
          />
          <TouchableOpacity onPress={this._handleOpenWithWebBrowser}>
            <Text
              style={{
                color: "#909090",
                paddingRight: 30,
                paddingLeft: 10,
                fontSize: 13,
                fontFamily: "NanumSquareRoundEB"
              }}
            >
              Special Thanks Nomad Coders and moondaddi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ),
    drawerWidth: 200,
    initialRouteName: this.state.initialScreen,

    cardStyle: {
      backgroundColor: "transparent"
    },
    // style: {
    //   elevation: 4,
    //   shadowOffset: { width: 5, height: 5 },
    //   shadowColor: "black",
    //   shadowOpacity: 1,
    //   shadowRadius: 10
    // },
    drawerType: "slide",
    drawerBackgroundColor: "#272727",
    contentOptions: {
      activeTintColor: "#fff",
      inactiveTintColor: "#979797",
      itemsContainerStyle: {
        marginVertical: 10
      },
      activeBackgroundColor: {
        backgroundColor: "transparent"
      },
      itemStyle: {
        marginVertical: 8
      },
      iconContainerStyle: {
        opacity: 1,
        width: 50,
        height: 50,
        marginHorizontal: 0,
        justifyContent: "center"
      },

      labelStyle: {
        fontSize: 19,
        fontFamily: "NanumSquareRoundEB",
        margin: 0
      }
    }
  }
);

export default DrawerNavigator;

const styles = StyleSheet.create({
  callLeftmenu: {
    width: 24,
    height: 20,
    marginLeft: 26,
    marginTop: 10
  }
});
