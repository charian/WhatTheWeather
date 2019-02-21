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
  Platform
} from "react-native";
import { LinearGradient } from "expo";
import { DrawerActions } from "react-navigation";
import SelectLocation from "../location";
import { WeatherContext } from "../Context";
import { withWeather } from "../Context";
import { API_KEY } from "../Keys";
import { ifIphoneX } from "react-native-iphone-x-helper";
import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import i18n from "i18n-js";
let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

class AddLocationScreen extends React.Component {
  static navigationOptions = {
    title: "AddLocation",
    headerTransparent: true
  };
  constructor() {
    super();

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
      savedLocationLists: null,
      catchLocation: null,
      locationdelKey: null,
      keywordNULL: null
    };
  }
  onChangeText = text => {
    // 한글일때 1글자 이상, 영어일때 3글자 이상, 한글이나 영어가 아닐 경우 불가능
    if (/[a-zA-Z.]/.test(this.state.keywordValue) === true) {
      // 영어일때
      if (this.state.TextValue > 2) {
        this.setState({
          endDebounce: "changed! English Keyword Fetch start",
          keywordNULL: ""
        });
        fetch(
          `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&language=en-us&q=` +
            this.state.keywordValue
        )
          .then(response => response.json())
          .then(autocompleteResult => {
            console.log(autocompleteResult);
            this.setState({
              locationList: autocompleteResult,
              isLoading: false
            });
            if (autocompleteResult.length === 0) {
              Alert.alert(
                "No results found",
                this.state.keywordValue +
                  "does not exist. Please enter another keyword.",
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            }
            // console.log(this.state.locationList[0].LocalizedName);
            // console.log(autocompleteResult);
          })
          .catch(error => {
            console.error(error);
          });
        console.log(
          this.state.endDebounce + "Keywords : " + this.state.keywordValue
        );
      }
    } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(this.state.keywordValue) === true) {
      // 한글일때
      if (this.state.TextValue > 0) {
        this.setState({
          endDebounce: "changed! Korean Keyword Fetch start",
          keywordNULL: ""
        });
        fetch(
          `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${API_KEY}&language=ko-kr&q=` +
            this.state.keywordValue
        )
          .then(response => response.json())
          .then(autocompleteResult => {
            console.log(autocompleteResult);
            this.setState({
              locationList: autocompleteResult,
              isLoading: false
            });
            if (autocompleteResult.length === 0) {
              Alert.alert(
                "No results found",
                this.state.keywordValue +
                  "does not exist. Please enter another keyword.",
                [
                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
              );
            }
            // console.log(this.state.locationList[0].LocalizedName);
            // console.log(autocompleteResult);
          })
          .catch(error => {
            Alert.alert(
              "No results found",
              this.state.TextValue +
                "does not exist. Please enter another keyword.",
              [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
            console.error(error);
          });
        console.log(
          this.state.endDebounce + "Keywords : " + this.state.keywordValue
        );
      }
    } else if (
      /[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z.]]/.test(this.state.keywordValue) == false
    ) {
      // 둘 다 아닐때
      if (this.state.TextValue > 0) {
        console.log("type input keyword" + this.state.keywordValue);
        this.setState({
          keywordNULL: "Local keywords only support English and Korean."
        });
      }
    }
  };

  componentWillMount = () => {
    this._loadLocations();
    this._getLocations();
    console.log(/[[ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z.]]/.test("ニープレ") === false);
  };

  componentWillUpdate = () => {};

  GetValueFunction = ValueHolder => {
    var Value = ValueHolder.length.toString(); // 입력한 글자를 받아와 length를 구함.
    var keyword = ValueHolder;
    this.setState({ TextValue: Value });
    this.setState({ keywordValue: keyword });
  };

  _onChangeTextDelayed = ValueHolder => {
    this._onChangeTextDelayed = _.debounce(this.onChangeText, 2000);
  };

  _removeLocation = async () => {
    await AsyncStorage.removeItem("LocationKeys");
    console.log("remove!");
    this._loadLocations();
  };

  _loadLocations = async () => {
    try {
      const savedLocations = await AsyncStorage.getItem("LocationKeys");
      this.setState({
        savedLocations: JSON.parse(savedLocations)
      });
      console.log("_loadLocations: " + savedLocations);
      console.log("numbers : " + JSON.parse(savedLocations).length);
      //console.log(JSON.parse(Locations).length);
    } catch (err) {
      console.log("error");
      console.log(err);
    }
  };

  _getLocations = async () => {
    console.log(savedLocations);
  };

  _saveLocations = async locationKey => {
    console.log("뭣이 넘어오나" + locationKey);

    const ID = locationKey[0];
    const locationName = locationKey[1];
    const stateName = locationKey[2];
    const contryName = locationKey[3];

    this.setState(locationKey => {
      //const ID = locationKey[0];
      const locationObject = {
        [ID]: {
          locationName: locationName,
          stateName: stateName,
          contryName: contryName
        }
      };
      console.log(locationObject);
    });

    // 3개 이상 저장 못하게 기능 추가
    const { savedLocations } = this.state;
    let newLocationKeys = [];
    this._toast();
    try {
      if (savedLocations) {
        newLocationKeys = [...savedLocations, locationKey]; // 2개 이상부턴 object로 바뀐 값을 나눈 후 새로운 값을 합침
      } else {
        newLocationKeys = [locationKey];
      }
      await AsyncStorage.setItem(
        "LocationKeys",
        JSON.stringify(newLocationKeys)
      ); // 값을 저장한다.
      this._loadLocations();
      console.log("saved!@@@@@@@");
      console.log(savedLocations.length);
    } catch (err) {
      console.log(err); // try를 할 때 에러가 있다면 에러를 출력한다.
    }
    //console.log("savedLocations" + JSON.parse(savedLocations));
  };

  _selectFilter = async () => {
    return locationdelKey;
    console.log("_selectFilter " + locationdelKey);
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
  // const savedLocationString = await AsyncStorage.getItem('Locations);
  // const savedLocation = JSON.parse(savedLocationString);
  // //newLocation이 이미 저장된 값인지 검사
  // if(savedLocation.findIndex(item => item === newLocation) > 0) {
  //   newData = savedLocation;
  // } else {
  //   newData = [...savedLocation, newLocation];
  // }

  render() {
    //const { navigate } = this.props.navigation;
    //console.log("!!!!", this.props);
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
            style={{ width: 37, height: 45, alignSelf: "center" }}
            source={require("./../assets/images/icon-page-addlocation-2x.png")}
          />
          <View style={styles.StartContents}>
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t("locationPlaceholder")}
              returnKeyType={"search"}
              spellCheck={false}
              onChangeText={ValueHolder => {
                this.GetValueFunction(ValueHolder),
                  this._onChangeTextDelayed(ValueHolder);
              }}
            />

            <View style={styles.containerremarkOfSearch}>
              <Text style={styles.remarkOfSearch}>
                {i18n.t("remarkOfSearch")}
              </Text>
            </View>
            <View>
              <Text>{this.state.savedLocationLists}</Text>
            </View>
            <View>
              <Text>{this.state.keywordNULL}</Text>
            </View>
            <FlatList
              data={this.state.locationList}
              renderItem={({ item }) => (
                <View style={styles.locationList}>
                  <TouchableOpacity
                    onPress={() =>
                      this._saveLocations([
                        item.Key,
                        item.LocalizedName,
                        item.AdministrativeArea.LocalizedName,
                        item.Country.LocalizedName
                      ])
                    }
                  >
                    <Image
                      source={require("./../assets/images/icon-locationAdd-2x.png")}
                      style={{ width: 34, height: 34, marginRight: 5 }}
                    />
                  </TouchableOpacity>
                  <View style={styles.locationListTextContainer}>
                    <Text style={styles.locationListText}>
                      {item.LocalizedName}
                    </Text>
                    <Text style={styles.locationListSubText} numberOfLines={1}>
                      {item.AdministrativeArea.LocalizedName},{" "}
                      {item.Country.LocalizedName}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {/* <FlatList
              data={this.state.savedLocations}
              renderItem={({ item }) => (
                <View style={styles.locationList}>
                  <TouchableOpacity onPress={() => this._deleteLocation(item)}>
                    <Image
                      source={require("./../assets/images/icon-locationdel-2x.png")}
                      style={{ width: 34, height: 34 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.locationListText}>
                    {item[0]},{item[1]}{" "}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <View>
              <TouchableOpacity onPress={this._removeLocation}>
                <Text>delete location</Text>
              </TouchableOpacity>
            </View> */}
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
export default withWeather(AddLocationScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
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
    paddingVertical: 5,
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
    paddingTop: 4,
    alignItems: "center",
    marginBottom: 10
  },
  remarkOfSearch: {
    color: "#C1C1C1",
    fontFamily: "NanumSquareRoundEB",
    fontSize: 13
  },
  locationList: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center"
    //marginBottom: 10
  },
  locationListTextContainer: {
    flexDirection: "column"
  },
  locationListText: {
    fontSize: 19,
    color: "#373737",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6,
    marginBottom: 2,
    flex: 1
  },
  locationListSubText: {
    fontSize: 14,
    color: "#A2A2A2",
    fontFamily: "NanumSquareRoundEB",
    marginLeft: 6,
    flex: 1
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
    zIndex: 5
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
  }
});
