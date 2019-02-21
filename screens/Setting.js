import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Button,
  AsyncStorage,
  Alert,
  Platform,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo";
import {
  createStackNavigator,
  createAppContainer,
  StackActions,
  NavigationActions
} from "react-navigation";
import SelectLocation from "../location";
import { WeatherContext } from "../Context";
import { withWeather } from "../Context";
import { API_KEY } from "../Keys";
import { ifIphoneX } from "react-native-iphone-x-helper";
import SwitchSelector from "react-native-switch-selector";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import i18n from "i18n-js";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

const selectLocationRadio = {
  Select: {
    Images: require("./../assets/images/icon-Check-2x.png")
  },
  None: {
    Images: require("./../assets/images/icon-unCheck-2x.png")
  }
};

class SettingScreen extends React.Component {
  static navigationOptions = {
    title: "Setting"
  };
  constructor(props) {
    super(props);

    //console.log(this.props.navigation);

    this.state = {
      TextValue: "",
      endDebounce: null,
      keywordValue: null,
      loadedLocations: false,
      myKey: [],
      locationList: [],
      newLocation: "",
      Locations: {},
      savedLocations: null,
      savedLocationsLength: null,
      savedLocationLists: null,
      catchLocation: null,
      locationdelKey: null,
      currentLoc: null,
      selectLocation: null,
      selectLocationSelect: selectLocationRadio.Select.Images,
      selectLocationNone: selectLocationRadio.None.Images,
      setTemp: this.props.value.setTemp
    };

    this.reRenderSomething = this.props.navigation.addListener(
      "willFocus",
      () => {
        this._loadLocations();
        console.log("hello");
        // 이 컴포넌트가 다시 화면에 잡힐 때마다 실행하고 싶은 코드를 여기에 입력
      }
    );
  }

  componentDidMount = () => {
    this._loadLocations();
    this._loadCurrent();

    console.log("현재 설정값" + this.props.value.setTemp);
    console.log("현재 설정값" + this.props.value.setSpeed);
    console.log("현재 설정값" + this.props.value.setPre);
  };

  componentWillUnmount() {
    this.reRenderSomething;
  }

  _loadLocations = async () => {
    try {
      const savedLocations = await AsyncStorage.getItem("LocationKeys");
      this.setState({
        savedLocations: JSON.parse(savedLocations),
        savedLocationsLength: JSON.parse(savedLocations).length
      });
      // console.log("_loadLocations: " + savedLocations);
      // console.log("numbers : " + JSON.parse(savedLocations).length);
      // console.log("numbers : " + this.state.savedLocationsLength);
      //this._getLocation();
      //console.log(JSON.parse(Locations).length);
      //this._getSetting();
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  };

  _saveCurrent = async currentKey => {
    try {
      await AsyncStorage.setItem("currentLocation", JSON.stringify(currentKey));
      this.props.value._callCDUbyLocation();
      this._loadCurrent();
      this._toast();
      this.props.value._setDefaultLocation(currentKey);

      console.log("what?" + currentKey);
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
    try {
      await AsyncStorage.setItem("currentGPS", "0");
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
  };

  _saveCurrentGPS = async currentKey => {
    try {
      await AsyncStorage.setItem("currentLocation", JSON.stringify(currentKey));
      this.props.value._callCDUbyLocation();
      this._loadCurrent();
      this._toast();
      this.props.value._setDefaultLocation(currentKey);

      console.log("what?" + currentKey);
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
    try {
      await AsyncStorage.setItem("currentGPS", "1");
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
  };

  _saveInitial = async selectInitial => {
    try {
      await AsyncStorage.setItem("initialScreen", selectInitial);
      // this.setState({
      //   this.props.value.initialScreen : selectInitial
      // })
      console.log("what?" + selectInitial);
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
  };

  _loadCurrent = async () => {
    try {
      const savedCurrent = await AsyncStorage.getItem("currentLocation");
      this.setState({
        currentLoc: savedCurrent
      });
      console.log("now current location: " + this.state.currentLoc);

      // if (this.props.value.locationtext = ) {
      //   this.setState({
      //     selectLocation: selectLocationRadio.Select.Images
      //   });
      // } else {
      //   this.setState({
      //     selectLocation: selectLocationRadio.None.Images
      //   });
      // }
    } catch (err) {
      console.log("error");
      console.log(err);
    }
    if (this.props.value.GPSlocationKey === this.props.value.defaultLocation) {
      this._getImgUrl();
    } else {
      this._getImgUrlSaved(this.state.currentLoc);
    }
  };

  _deleteLocation = async locationdelKey => {
    const { savedLocations } = this.state;
    const { catchLocation } = this.state;
    console.log("선택한 지역 키" + locationdelKey[0]);
    this.setState({ locationdelKey: locationdelKey[0] });
    //console.log(savedLocations);
    //console.log(JSON.parse(savedLocations));
    try {
      const savedLocations = await AsyncStorage.getItem("LocationKeys");
      console.log("저장된 리스트를 가져옴 " + savedLocations);

      this.setState({
        //savedLocations: JSON.parse(savedLocations),
        catchLocation: this.state.savedLocations.filter(function(element) {
          return locationdelKey.indexOf(element[0]) === -1;
        })
      });
      console.log("저장된 리스트를 parse 함 : " + savedLocations);
      //console.log(savedLocations);
      await AsyncStorage.setItem(
        "LocationKeys",
        JSON.stringify(this.state.catchLocation)
      ); // 값을 저장한다.
      this._loadLocations();
      console.log("선택한 지역 제외한 리스트: " + this.state.catchLocation);
      //.filter(locationdelKey)
      //console.log(JSON.parse(Locations).length);
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  };

  _getImgUrl() {
    //console.log("현재 gps로 위치 잡고있어.");
    this.setState({
      selectLocation: selectLocationRadio.Select.Images
    });
    // if (this.props.value.GPSlocationKey === this.props.value.defaultLocation) {
    //   this.setState({
    //     selectLocation: selectLocationRadio.Select.Images
    //   });
    // } else {
    //   this.setState({
    //     selectLocation: selectLocationRadio.None.Images
    //   });
    // }
  }

  _getImgUrlSaved(setDefaultItem) {
    console.log("안녕2" + setDefaultItem);
    this.setState({
      selectLocation: selectLocationRadio.None.Images
    });
    if (this.props.value.GPSlocationKey === this.props.value.defaultLocation) {
      this.setState({
        selectLocation: selectLocationRadio.Select.Images
      });
    } else {
      // this.setState({
      //   selectLocation: selectLocationRadio.None.Images
      // });
    }
  }

  _setSelected = selectITem => {
    //console.log("뭐시 선택되어있을까" + selectITem, this.state.currentLoc);
    if (selectITem === JSON.parse(this.state.currentLoc)) {
      // console.log("매치된게 있나?" + selectITem);
      // console.log("이미지" + this.state.selectLocationSelect);
      return this.state.selectLocationSelect;
    } else {
      // console.log("매치된게 읍나?" + selectITem);
      // console.log("이미지" + this.state.selectLocationNone);
      return this.state.selectLocationNone;
    }
  };

  _locationItem = ({ item }) => (
    <View style={styles.locationList}>
      <TouchableOpacity
        onPress={() => this._saveCurrent(item[0])}
        style={{ position: "absolute", left: 5, top: 18 }}
      >
        <Image
          source={this._setSelected(item[0])}
          style={{ width: 26, height: 26 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this._deleteLocation(item)}
        style={{ position: "absolute", right: 5, top: 21 }}
      >
        <Image
          source={require("./../assets/images/icon-trash-2x.png")}
          style={{ width: 18, height: 20 }}
        />
      </TouchableOpacity>
      <View style={styles.locationListTextContainer}>
        <Text style={styles.locationListText}>{item[1]}</Text>
        <Text style={styles.locationListSubText} numberOfLines={1}>
          {item[2]}, {item[3]}
        </Text>
      </View>
    </View>
    // <MyListItem
    //   id={item.id}
    //   onPressItem={this._onPressItem}
    //   selected={!!this.state.selected.get(item.id)}
    //   title={item.title}
    ///>
  );
  _keyExtractor = (item, index) => item.id;

  _selectTempUnit = async getTemp => {
    try {
      await AsyncStorage.setItem("setTemp", getTemp);
      // this.setState({
      //   setTemp: getTemp
      // });
      this.props.value._callCDUbySetting();
      console.log(getTemp);
      this._toast();
      this.props.value._setSettingValue(getTemp);
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
  };

  _toast = () => {
    this.refs.toast.show(
      <View style={{}}>
        <Image
          source={require("./../assets/images/save-toast-2x.png")}
          style={{ width: 74, height: 74, alignSelf: "center" }}
        />
        <Text
          style={{
            color: "#fff",
            fontFamily: "NanumSquareRoundEB",
            fontSize: 16,
            paddingTop: 10
          }}
        >
          Setup Complete
        </Text>
      </View>,
      1000
    );
  };

  // _selectSpeedUnit = async getSpeed => {
  //   try {
  //     await AsyncStorage.setItem("setSpeed", getSpeed);
  //     // this.setState({
  //     //   setTemp: getTemp
  //     // });
  //     console.log(getSpeed);
  //   } catch (err) {
  //     console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
  //   }
  // };
  // _selectPreUnit = async getPre => {
  //   try {
  //     await AsyncStorage.setItem("setPre", getPre);
  //     // this.setState({
  //     //   setTemp: getTemp
  //     // });
  //     console.log(getPre);
  //   } catch (err) {
  //     console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
  //   }
  // };

  render() {
    const resetAction = StackActions.push({
      index: 0,
      routeName: "AddLocation"
      //actions: [NavigationActions.navigate({ routeName: "AddLocation" })]
    });
    return (
      <View style={styles.container}>
        <Toast
          ref="toast"
          style={{
            width: 190,
            height: 190,
            backgroundColor: "#373737",
            zIndex: 50000,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 40
          }}
          position="top"
          positionValue={250}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          //opacity={0.8}
          textStyle={{
            color: "#fff",
            fontFamily: "NanumSquareRoundEB",
            fontSize: 20
          }}
        />
        <View style={styles.backgroundColorinnerContainer}>
          <Image
            style={{ width: 45, height: 44, alignSelf: "center" }}
            source={require("./../assets/images/icon-page-setting-2x.png")}
          />
          <View style={styles.StartContents}>
            <ScrollView>
              <View style={styles.sectionListContainer}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>{i18n.t("unit")}</Text>
                </View>
                <View style={styles.sectionList}>
                  <Text style={styles.sectionListText}>
                    {i18n.t("metric")}, {i18n.t("imperial")}
                  </Text>
                  <SwitchSelector
                    initial={this.state.setTemp}
                    onPress={value => this._selectTempUnit(value)}
                    textColor={"#3F3F3F"} //'#7a44cf'
                    selectedColor={"#fff"}
                    buttonColor={"#FF452C"}
                    borderColor={"#FF452C"}
                    //borderWidth={2}
                    height={32}
                    style={{
                      width: 100,
                      borderWidth: 2,
                      borderRadius: 20,
                      borderColor: "#FF452C",
                      opacity: 1,
                      position: "absolute",
                      right: 5,
                      top: 12
                    }}
                    textStyle={{
                      fontFamily: "NanumSquareRoundEB",
                      fontSize: 14
                    }}
                    selectedTextStyle={{
                      fontFamily: "NanumSquareRoundEB",
                      fontSize: 14
                    }}
                    options={[
                      { label: i18n.t("met"), value: "M" }, //images.feminino = require('./path_to/assets/img/feminino.png')
                      { label: i18n.t("imp"), value: "I" } //images.masculino = require('./path_to/assets/img/masculino.png')
                    ]}
                  />
                </View>
                <View style={{ paddingVertical: 10 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontFamily: "NanumSquareRoundEB",
                        fontSize: 12,
                        color: "#9A9A9A"
                      }}
                    >
                      {i18n.t("metric")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "NanumSquareRoundEB",
                        fontSize: 10,
                        color: "#9A9A9A"
                      }}
                    >
                      Square millimeter, Hectare, Square kilometer, Celsius
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "NanumSquareRoundEB",
                        fontSize: 12,
                        color: "#9A9A9A"
                      }}
                    >
                      {i18n.t("imperial")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "NanumSquareRoundEB",
                        fontSize: 10,
                        color: "#9A9A9A"
                      }}
                    >
                      Square inch, Square yard, Square mile, Fahrenheit
                    </Text>
                  </View>
                </View>
              </View>

              {/* <View style={styles.sectionListContainer}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Initial Screen</Text>
                </View>
                <View style={styles.sectionList}>
                  <TouchableOpacity
                    onPress={() => this._saveInitial("Temp")}
                    style={{ position: "absolute", left: 5, top: 14 }}
                  >
                    <Image
                      source={this.state.selectLocation}
                      style={{ width: 26, height: 26 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.sectionListText01}>Temperature</Text>
                </View>
                <View style={styles.sectionList}>
                  <TouchableOpacity
                    onPress={() => this._saveInitial("Aq")}
                    style={{ position: "absolute", left: 5, top: 14 }}
                  >
                    <Image
                      source={this.state.selectLocation}
                      style={{ width: 26, height: 26 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.sectionListText01}>Air Quality</Text>
                </View>
                <View style={styles.sectionList}>
                  <TouchableOpacity
                    onPress={() => this._saveInitial("Precip")}
                    style={{ position: "absolute", left: 5, top: 14 }}
                  >
                    <Image
                      source={this.state.selectLocation}
                      style={{ width: 26, height: 26 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.sectionListText01}>Precipitation</Text>
                </View>
                <View style={styles.sectionList}>
                  <TouchableOpacity
                    onPress={() => this._saveInitial("Sky")}
                    style={{ position: "absolute", left: 5, top: 14 }}
                  >
                    <Image
                      source={this.state.selectLocation}
                      style={{ width: 26, height: 26 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.sectionListText01}>Sky</Text>
                </View>
              </View> */}

              <View style={styles.sectionListContainer}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>
                    {i18n.t("SavedLocations")}
                  </Text>
                  <View style={styles.sectionTitleBtns}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.dispatch(resetAction)
                      }
                      style={styles.btnsPress}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#3F3F3F",
                          fontFamily: "NanumSquareRoundEB"
                        }}
                      >
                        {i18n.t("Add")}
                      </Text>
                      <Image
                        source={require("./../assets/images/icon-title-right-2x.png")}
                        style={{ width: 8, height: 15, marginLeft: 3 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.locationList}>
                  <TouchableOpacity
                    onPress={() =>
                      this._saveCurrentGPS(this.props.value.GPSlocationKey)
                    }
                    style={{ position: "absolute", left: 5, top: 18 }}
                  >
                    <Image
                      source={this.state.selectLocation}
                      style={{ width: 26, height: 26 }}
                    />
                  </TouchableOpacity>
                  <View style={styles.locationListTextContainer}>
                    <Text style={styles.locationListText}>GPS Location</Text>
                    <Text style={styles.locationListSubText} numberOfLines={1}>
                      {this.props.value.GPSLocalizedName},{" "}
                      {this.props.value.GPSCountryName}
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={this.state.savedLocations}
                  style={{ flex: 1 }}
                  renderItem={this._locationItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </ScrollView>
            {/* <Button
              title="Go to Add Location"
              onPress={() => this.props.navigation.dispatch(resetAction)}
            /> */}
          </View>
        </View>
        <LinearGradient
          colors={["#FFDC00", "transparent"]}
          start={[1, 0]}
          end={[0, 0]}
          style={[this.props.value.aqGradient]}
        />
        <LinearGradient
          colors={["#110035", "transparent"]}
          start={[0, 0]}
          end={[0, 1]}
          style={[this.props.value.isDayTimeGradientsTate]}
        />
      </View>
    );
  }
}
export default withWeather(SettingScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,

    ...ifIphoneX(
      {
        paddingTop: 54 //iphone x style
      },
      {
        paddingTop: 25 // default style
      }
    ),
    ...Platform.select({
      android: {
        paddingTop: 25
      }
    }),
    paddingBottom: 25
  },
  StartContents: {
    marginTop: 70,
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  formInput: {
    paddingLeft: 5,
    height: 50,
    borderWidth: 1,
    borderColor: "#555555"
  },
  formButton: {
    borderWidth: 1,
    borderColor: "#555555"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    marginTop: 5
  },

  containerremarkOfSearch: {
    paddingTop: 10,
    alignItems: "center",
    marginBottom: 10
  },
  remarkOfSearch: {
    color: "#C1C1C1",
    fontFamily: "NanumSquareRoundEB",
    fontSize: 13
  },

  backgroundColorinnerContainer: {
    backgroundColor: "#fff",
    flex: 1,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderRadius: 26,
    padding: 23,
    zIndex: 0

    // ...ifIphoneX(
    //   {
    //     paddingTop: 60 //iphone x style
    //   },
    //   {
    //     paddingTop: 23 // default style
    //   }
    // ),
    // ...Platform.select({
    //   android: {
    //     paddingTop: 23
    //   }
    // })
  },
  searchInput: {
    width: "100%",
    height: 60,
    borderColor: "#D9D9D9",
    borderWidth: 3,
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 19,
    color: "#373737",
    fontFamily: "NanumSquareRoundEB"
  },
  sectionListContainer: {
    marginBottom: 25
  },
  locationList: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9"
  },
  locationListText: {
    fontSize: 15,
    color: "#373737",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6
  },
  sectionTitle: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9",
    paddingVertical: 20,
    flexDirection: "row"
    // justifyContent: "flex-start"
  },
  sectionTitleBtns: {
    position: "absolute",
    right: 5,
    top: 24
  },
  btnsPress: {
    flexDirection: "row"
  },
  sectionTitleText: {
    fontSize: 20,
    color: "#3F3F3F",
    fontFamily: "NanumSquareRoundEB",
    alignSelf: "flex-start"
  },
  sectionList: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9",
    paddingVertical: 20,
    paddingLeft: 4
  },
  sectionListText: {
    fontSize: 15,
    color: "#3F3F3F",
    fontFamily: "NanumSquareRoundEB"
  },
  sectionListText01: {
    fontSize: 15,
    color: "#3F3F3F",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 33
  },
  locationListTextContainer: {
    flexDirection: "column",
    marginLeft: 17
  },
  locationListText: {
    fontSize: 15,
    color: "#373737",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6,
    marginBottom: 2,
    flex: 1
  },
  locationListSubText: {
    fontSize: 13,
    color: "#A2A2A2",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6,
    flex: 1
  }
});
