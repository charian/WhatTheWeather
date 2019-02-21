import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  AsyncStorage,
  Button,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import { LinearGradient } from "expo";
import { WeatherContext } from "./Context";
import { withWeather } from "./Context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Toast, { DURATION } from "react-native-easy-toast";
import i18n from "i18n-js";
const selectLocationRadio = {
  Select: {
    Images: require("./assets/images/icon-Check-2x.png")
  },
  None: {
    Images: require("./assets/images/icon-unCheck-2x.png")
  }
};

class SelectLocation extends React.Component {
  static navigationOptions = {
    title: "location"
  };
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
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
      selectLocationNone: selectLocationRadio.None.Images
    };
    //console.log("location imported" + this.state.value1);
  }

  async componentDidMount() {
    // if () {
    // }
    // console.log("location js imported");
    // console.log("saved location " + this.state.savedLocations);
    // console.log("currentLoc " + this.state.currentLoc);
    // console.log("defaultLocation " + this.state.defaultLocation);
    //console.log('selected location ' +this.state.selectLocation);
  }

  _toggleModal = () => {
    console.log("gps key : " + this.props.value.value.GPSlocationKey);
    this.setState({ isModalVisible: !this.state.isModalVisible });
    this._loadCurrent();
    this._loadLocations();

    //this._locationItem(item);
    //console.log(this.state.savedLocations);
  };

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
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  };

  _saveCurrent = async currentKey => {
    try {
      await AsyncStorage.setItem("currentLocation", JSON.stringify(currentKey));
      this.props.value.value._callCDUbyLocation();
      this._loadCurrent();
      this._toggleModal();
      this._toast();
      this.props.value.value._setDefaultLocation(currentKey);
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
      this.props.value.value._callCDUbyLocation();
      this._loadCurrent();
      this._toggleModal();
      this._toast();
      this.props.value.value._setDefaultLocation(currentKey);
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

  _loadCurrent = async () => {
    try {
      const savedCurrent = await AsyncStorage.getItem("currentLocation");
      this.setState({
        currentLoc: savedCurrent
      });
      //console.log("now current location: " + this.state.currentLoc);

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
    if (
      this.props.value.value.GPSlocationKey ===
      this.props.value.value.defaultLocation
    ) {
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
    if (
      this.props.value.value.GPSlocationKey ===
      this.props.value.value.defaultLocation
    ) {
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
    console.log(item[0] + item[1]),
    (
      <View style={{ flex: 1, Height: 100 }}>
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
            source={require("./assets/images/icon-trash-2x.png")}
            style={{ width: 18, height: 20 }}
          />
        </TouchableOpacity>
        <View style={styles.locationListTextContainer}>
          <Text style={styles.locationListText}>{item[1]}</Text>
          <Text style={styles.locationListSubText} numberOfLines={1}>
            asd, {item[2]}, {item[3]},
          </Text>
        </View>
      </View>
      // <MyListItem
      //   id={item.id}
      //   onPressItem={this._onPressItem}
      //   selected={!!this.state.selected.get(item.id)}
      //   title={item.title}
      ///>
      //console.log("asdicsoijasoijasoi" + item[1])
    )
  );

  _toast = () => {
    this.refs.toast.show(
      <View style={{}}>
        <Image
          source={require("./assets/images/save-toast-2x.png")}
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
  render() {
    //console.log(this.props.value.navigation);
    return (
      <View style={styles.locationContainer}>
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
        <TouchableOpacity
          onPress={this._toggleModal}
          style={styles.locationTitle}
        >
          <Text style={styles.indexLocationText} numberOfLines={1}>
            {this.props.value.value.locationtext}
          </Text>
          <MaterialCommunityIcons
            name="menu-down"
            size={32}
            color="white"
            style={styles.locationCallIcon}
          />
        </TouchableOpacity>

        <Modal
          isVisible={this.state.isModalVisible}
          animationIn="bounceIn"
          easing="ease-in"
          animationOut="fadeOut"
          backdropOpacity={0.3}
          onBackdropPress={this._toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.sectionListContainer}>
              <View style={styles.sectionTitle}>
                <Text style={styles.sectionTitleText}>
                  {i18n.t("SavedLocations")}
                </Text>
              </View>

              <View style={styles.locationList}>
                <TouchableOpacity
                  onPress={() =>
                    this._saveCurrentGPS(this.props.value.value.GPSlocationKey)
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
                    {this.props.value.value.GPSLocalizedName},{" "}
                    {this.props.value.value.GPSCountryName}
                  </Text>
                </View>
              </View>
              <FlatList
                style={{ maxHeight: 250 }}
                data={this.state.savedLocations}
                renderItem={({ item }) => (
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
                        source={require("./assets/images/icon-trash-2x.png")}
                        style={{ width: 18, height: 20 }}
                      />
                    </TouchableOpacity>
                    <View style={styles.locationListTextContainer}>
                      <Text style={styles.locationListText}>{item[1]}</Text>
                      <Text
                        style={styles.locationListSubText}
                        numberOfLines={1}
                      >
                        {item[2]}, {item[3]}
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <FlatList
                data={this.state.savedLocations}
                style={{ flex: 1, minheight: 500 }}
                renderItem={this._locationItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            {/* <TouchableOpacity
              onPress={() => this.props.value.navigation.navigate("Setting")}
              onPressOut={this._toggleModal}
              style={styles.locationTitle}
            >
              <View>
                <Text>ADD New Location{"\n"}by Keyword</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.modalContainer1}>
            <TouchableOpacity
              onPress={() => this.props.value.navigation.navigate("Setting")}
              onPressOut={this._toggleModal}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={{
                    width: 33,
                    height: 40,
                    alignSelf: "center",
                    marginRight: 10
                  }}
                  source={require("./assets/images/icon-page-addlocation-2x.png")}
                />
                <Text style={styles.sectionListText}>
                  {i18n.t("saveAnother")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withWeather(SelectLocation);

const styles = StyleSheet.create({
  locationContainer: {
    position: "absolute",
    ...ifIphoneX(
      {
        top: 58 //iphone x style
      },
      {
        top: 34 // default style
      }
    ),
    ...Platform.select({
      android: {
        top: 44
      }
    }),
    left: 54,
    flex: 1,
    zIndex: 100000000
  },
  locationTitle: {
    alignItems: "stretch",
    marginLeft: 15,
    flexDirection: "row"
  },
  indexLocationText: {
    fontSize: 27,
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    maxWidth: 220
  },
  modalContainer: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 99,
    borderRadius: 25,
    padding: 25,
    paddingBottom: 10
  },
  modalContainer1: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 99,
    borderRadius: 25,
    padding: 25,
    marginTop: 25
  },
  locationList: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center"
    // borderBottomWidth: 1,
    // borderBottomColor: "#E9E9E9"
  },

  sectionTitle: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#E9E9E9",
    paddingTop: 0,
    paddingBottom: 15,
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
    fontFamily: "NanumSquareRoundEB"
    //alignSelf: "flex-start"
  },
  sectionList: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#E9E9E9",
    paddingVertical: 20,
    paddingLeft: 4
  },
  sectionListText: {
    fontSize: 17,
    color: "#3F3F3F",
    fontFamily: "NanumSquareRoundEB"
  },
  locationListTextContainer: {
    flexDirection: "column",
    marginLeft: 17
  },
  locationListText: {
    fontSize: 16,
    color: "#373737",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6,
    marginBottom: 2
    //flex: 1
  },
  locationListSubText: {
    fontSize: 14,
    color: "#A2A2A2",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6
    //flex: 1
  }
});
