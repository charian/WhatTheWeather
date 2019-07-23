import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Dimensions,
  FlatList,
  ToastAndroid,
  BackHandler
} from "react-native";
import { LinearGradient } from "expo";
import { WeatherContext } from "../Context";
import { withWeather } from "../Context";
import SelectLocation from "../location";
import { MonoText } from "../components/StyledText";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";
import { Localization } from "expo-localization";
import { ifIphoneX } from "react-native-iphone-x-helper";
import SegmentedControlTab from "react-native-segmented-control-tab";
import RF from "react-native-responsive-fontsize";
import i18n from "i18n-js";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

class TempScreen extends React.Component {
  static navigationOptions = {
    title: "temp"
  };

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
      isModalVisible1: false,
      timeStyle: null,
      customStyleIndex: 0,
      hourlyWeathers: [],
      hourlyWeathersIm: [],

      hourlyTime: null,
      hourlyWeather: null,
      hourlyWindSpeed: null,
      hourlyWindUnit: null,
      hourlyTemperature: null,
      hourlyReal: null,
      dailyWeathers: [],
      weatherImage: null,
      weatherSmallImage: this.props.value.weatherCases,
      weatherText: [],
      dailyHeadline: null,
      hourlyText: i18n.t("Hourly"),
      windCalc: null
    };
    // this.reRenderSomething = this.props.navigation.addListener(
    //   "willFocus",
    //   () => {
    //     this.componentDidMount();
    //     //this.props._loadLocations();
    //     console.log("hello");
    //     // 이 컴포넌트가 다시 화면에 잡힐 때마다 실행하고 싶은 코드를 여기에 입력
    //   }
    // );
  }

  _toggleModal1 = () =>
    this.setState({ isModalVisible1: !this.state.isModalVisible1 });

  _changeSwipe = index => {
    console.log("change" + index);
  };

  handleCustomIndexSelect = (index: number) => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
    console.log(this.state.customStyleIndex);
  };

  componentDidMount = () => {
    // console.log(this.props.value.accuweatherKEY);
    //console.log("!!!!", this.props);
    //console.log("by temp" + this.props.value.weatherCasesObject);

    // console.log(
    //   "Current screen name : " + this.props.navigation.state.routeName
    // );
    // if (this.props.navigation.state.routeName === "Temp") {
    //   BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    // } else {
    //   this.exitApp = false;
    //   BackHandler.removeEventListener(
    //     "hardwareBackPress",
    //     this.handleBackButton
    //   );
    // }

    if (this.props.value.setTemp === "0") {
      this.setState({
        windCalc: 3.6
      });
    } else {
      this.setState({
        windCalc: 1
      });
    }
  };

  // componentWillUnmount() {
  //   this.exitApp = false;
  //   BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  // }
  // handleBackButton = () => {
  //   // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
  //   if (this.exitApp == undefined || !this.exitApp) {
  //     ToastAndroid.show("한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
  //     this.exitApp = true;

  //     this.timeout = setTimeout(
  //       () => {
  //         this.exitApp = false;
  //       },
  //       2000 // 2초
  //     );
  //   } else {
  //     clearTimeout(this.timeout);

  //     BackHandler.exitApp(); // 앱 종료
  //   }
  //   return true;
  // };
  _getHourly = () => {};

  render() {
    //const { navigate } = this.props.navigation;
    //console.log(this.props.navigation);
    const { customStyleIndex, weatherSmallImage } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          zIndex: 10
        }}
      >
        <SelectLocation value={this.props} />

        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          loop={false}
          showsPagination={true}
          activeDotColor={"white"}
          bounces={true}
          //index={0}
          onIndexChanged={index => {
            this._changeSwipe(index);
            console.log(index);
          }}
          //onScrollBeginDrag={console.log("start swipe")}
          paginationStyle={{
            ...ifIphoneX(
              {
                marginBottom: -3 //iphone x style
              },
              {
                marginBottom: -18 // default style
              }
            ),
            ...Platform.select({
              android: {
                marginBottom: -18
              }
            })
          }}
        >
          <View style={{ flex: 1, backgroundColor: "transparent", zIndex: 10 }}>
            <View style={styles.upper}>
              <Image
                source={this.props.value.weatherImage}
                //resizeMode="cover"
                style={{
                  //width: Dimensions.get('window').width * 0.6,
                  //height: 200,
                  width: this.props.value.weatherImageWidth,
                  height: this.props.value.weatherImageHeight,
                  alignSelf: "center",
                  marginBottom: this.props.value.weatherImagemarginBottom
                  // zIndex: 90
                }}
              />
            </View>
            <View style={styles.lower}>
              <View style={styles.lowerDgree}>
                <Text style={styles.currentTemp}>
                  {this.props.value.temperature}
                </Text>
                <Text style={styles.currentTempDeg}>º</Text>
                <Text style={styles.currentReal}>
                  / {this.props.value.realFeel}
                </Text>
                <Text style={styles.currentRealDeg}>º</Text>
                {/* <TouchableOpacity
                  onPress={this._toggleModal1}
                  style={styles.locationTitle}
                >
                  <Image
                    source={require("./../assets/images/badge-realfeel-2x.png")}
                    style={styles.realFeelBadge}
                  />
                </TouchableOpacity> */}
                <Modal
                  isVisible={this.state.isModalVisible1}
                  animationIn="bounceIn"
                  easing="ease-in"
                  animationOut="fadeOut"
                  backdropOpacity={0.3}
                  onBackdropPress={this._toggleModal1}
                >
                  <View style={styles.modalContainer}>
                    <View style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          fontFamily: "NanumSquareRoundEB",
                          fontSize: 25
                        }}
                      >
                        RealFeel®
                      </Text>
                    </View>
                    <View>
                      <ScrollView style={{ maxHeight: 250 }}>
                        <Text
                          style={{
                            fontFamily: "NanumSquareRoundEB",
                            fontSize: 15,
                            color: "#A2A2A2",
                            lineHeight: 20
                          }}
                        >
                          {i18n.t("realfeel")}
                        </Text>
                      </ScrollView>
                      {/* <Text>Any Added Location</Text>
                      <Button
                        title="Go to Setting screen"
                        onPress={() =>
                          this.props.navigation.navigate("Setting")
                        }
                      /> */}
                    </View>
                    {/* <TouchableOpacity onPress={this._toggleModal1}>
                      <Text>Hide me!</Text>
                    </TouchableOpacity> */}
                  </View>
                </Modal>
                <View style={styles.tempYesterday}>
                  <Text style={styles.tempYesterdayText}>
                    {/* {this.props.value.thenyesterday}º{" "} */}
                    {this.props.value.thenYesterdayCompare},{" "}
                    {this.props.value.nameFull}
                  </Text>
                  <Text style={styles.tempYesterdayText} numberOfLines={1}>
                    {this.props.value.dailyHeadline}
                  </Text>
                </View>
              </View>

              <View style={styles.lowerEtc}>
                <View
                  style={styles.lowerEtcWidget}
                  style={{ marginRight: 20, maxWidth: "25%", minWidth: "20%" }}
                >
                  <Image
                    source={require("./../assets/images/icon-aq-2x.png")}
                    style={{ width: 29, height: 27 }}
                  />
                  <Text style={styles.lowerEtcTitle}>
                    {i18n.t("airquality")}
                  </Text>
                  <Text style={styles.lowerEtcValue01} numberOfLines={1}>
                    {this.props.value.AQIResult}
                  </Text>
                </View>
                <View
                  style={styles.lowerEtcWidget}
                  style={{ marginTop: 3, marginRight: 20, minWidth: "17%" }}
                >
                  <Image
                    source={require("./../assets/images/icon-senset-2x.png")}
                    style={{ width: 26, height: 24 }}
                  />
                  <Text style={styles.lowerEtcTitle}>
                    {this.props.value.sunLabel}
                  </Text>
                  <Text style={styles.lowerEtcValue}>
                    {this.props.value.sunLabelTime}
                  </Text>
                </View>
                <View
                  style={styles.lowerEtcWidget}
                  style={{ marginTop: 1, marginRight: 20, minWidth: "15%" }}
                >
                  <Image
                    source={require("./../assets/images/icon-hu-2x.png")}
                    style={{ width: 21, height: 27 }}
                  />
                  <Text style={styles.lowerEtcTitle}>{i18n.t("humidity")}</Text>
                  <Text style={styles.lowerEtcValue}>
                    {this.props.value.humidity}%
                  </Text>
                </View>
                <View style={styles.lowerEtcWidget} style={{ marginTop: 4 }}>
                  <Image
                    source={require("./../assets/images/icon-wind-2x.png")}
                    style={{ width: 22, height: 23 }}
                  />
                  <Text style={styles.lowerEtcTitle}>{i18n.t("wind")}</Text>
                  <Text style={styles.lowerEtcValue}>
                    {this.props.value.windSpeed}
                    {this.props.value.windUnit}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.houtlyContainer}>
            <View style={styles.houtlyContainerInner}>
              <View>
                <Image
                  source={this.props.value.weatherImage}
                  //resizeMode="cover"
                  style={{
                    //width: Dimensions.get('window').width * 0.6,
                    //height: 200,
                    width: this.props.value.weatherImageWidthSmall,
                    height: this.props.value.weatherImageHeightSmall,
                    alignSelf: "center"
                    //marginTop: 7
                    // zIndex: 90
                  }}
                />
              </View>

              <View style={{ flex: 1, height: 100 }}>
                <View style={styles.houtlyContainerInner01}>
                  <Text style={styles.currentTempSmall}>
                    {this.props.value.temperature}
                  </Text>
                  <Text style={styles.currentTempDegSmall}>º</Text>
                  <Text style={styles.currentRealSmall}>
                    / {this.props.value.realFeel}
                  </Text>
                  <Text style={styles.currentRealDegSmall}>º</Text>
                  {/* 
                  <TouchableOpacity onPress={this._toggleModal1}>
                    <Image
                      source={require("./../assets/images/badge-realfeel-2x.png")}
                      style={styles.realFeelBadgeSmall}
                    />
                  </TouchableOpacity> */}
                </View>
                <View style={styles.houtlyContainerInner02}>
                  <Text style={styles.tempYesterdayTextSmall}>
                    {this.props.value.thenYesterdayCompare}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.backgroundColorinnerContainer}>
              <SegmentedControlTab
                values={[i18n.t("Hourly"), i18n.t("Daily")]}
                selectedIndex={customStyleIndex}
                onTabPress={this.handleCustomIndexSelect}
                borderRadius={0}
                selectedIndices={[0]}
                //onTabPress={console.log(this.props.values)}
                tabsContainerStyle={{
                  height: 48,
                  backgroundColor: "#ffffff"
                }}
                tabStyle={{
                  backgroundColor: "#Ffffff",
                  borderBottomWidth: 3,
                  borderBottomColor: "#ffffff",
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderColor: "#fff"
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomWidth: 3,
                  borderBottomColor: "#D9D9D9",
                  borderTopWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderColor: "#fff"
                }}
                tabTextStyle={{
                  color: "#D9D9D9",
                  fontSize: 19,
                  fontFamily: "NanumSquareRoundEB"
                }}
                activeTabTextStyle={{
                  color: "#3F3F3F",
                  fontSize: 19,
                  fontFamily: "NanumSquareRoundEB"
                }}
              />
              {customStyleIndex === 0 && (
                <View style={styles.containerWeatherList}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.hourlyCell01]}>
                      {i18n.t("Time")}
                    </Text>
                    <Text style={[styles.tableHeaderText, styles.hourlyCell02]}>
                      {i18n.t("Weather")}
                    </Text>
                    <Text style={[styles.tableHeaderText, styles.hourlyCell03]}>
                      {i18n.t("wind")}
                    </Text>
                    <Text style={[styles.tableHeaderText, styles.hourlyCell04]}>
                      {i18n.t("Temp")} / {i18n.t("Feel")}
                    </Text>
                  </View>
                  <ScrollView style={styles.containerWeatherListInner}>
                    <FlatList
                      data={
                        this.props.value.hourlyWeathers
                        //this.props.value.hourlyWindUnit

                        //, this.state.hourlyWeathersIm
                      }
                      renderItem={({
                        item
                        //  itemWind
                      }) => (
                        <View style={styles.locationList}>
                          <View style={styles.tableBody}>
                            <Text
                              style={[
                                styles.tableBodyText,
                                styles.hourlyCell01
                              ]}
                            >
                              {item.DateTime.substring(11, 16)}
                            </Text>
                            <Text
                              style={[
                                styles.tableBodyText,
                                styles.hourlyCell02
                              ]}
                            >
                              {item.IconPhrase}
                              {/* {weatherSmallImage.item.IconPhrase} */}
                            </Text>

                            <Text
                              style={[
                                styles.tableBodyText,
                                styles.hourlyCell03
                              ]}
                            >
                              {Math.round(
                                item.Wind.Speed.Value / this.state.windCalc
                              )}
                              {this.props.value.windUnit}
                            </Text>
                            <Text
                              style={[
                                styles.tableBodyText,
                                styles.hourlyCell04
                              ]}
                            >
                              {item.Temperature.Value}º /{" "}
                              {item.RealFeelTemperature.Value}º
                            </Text>
                          </View>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </ScrollView>
                </View>
              )}
              {customStyleIndex === 1 && (
                <ScrollView>
                  <View style={styles.containerHeadline}>
                    <Image
                      source={require("./../assets/images/icon-headline-2x.png")}
                      style={{ width: 28, height: 20, marginBottom: 7 }}
                    />
                    <Text style={styles.headline}>
                      {this.props.value.dailyHeadline}
                    </Text>
                  </View>
                  <FlatList
                    data={
                      this.props.value.dailyWeathers
                      //, this.state.hourlyWeathersIm
                    }
                    renderItem={({
                      item
                      //, itemIm
                    }) => (
                      <View style={styles.rowDaily}>
                        <View style={styles.dailyTemp}>
                          <View>
                            <Text style={styles.dailyDate}>
                              {item.Date.substring(5, 10)}
                            </Text>
                          </View>
                          <View style={styles.conatinerDeg}>
                            <View style={styles.deg}>
                              <Text style={styles.min}>{i18n.t("min")}</Text>
                              <Text style={styles.dailyDeg}>
                                {item.Temperature.Minimum.Value}
                              </Text>
                            </View>
                            <View style={styles.slash}>
                              <Text>/</Text>
                            </View>
                            <View style={styles.deg}>
                              <Text style={styles.max}>{i18n.t("max")}</Text>
                              <Text style={styles.dailyDeg}>
                                {item.Temperature.Maximum.Value}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.dailyWeather}>
                          <View>
                            <Text style={styles.dailyWeatherDay}>
                              {i18n.t("day")}
                            </Text>
                            <Text style={styles.dailyWeatherText}>
                              {item.Day.IconPhrase}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.dailyWeatherDay}>
                              {i18n.t("night")}
                            </Text>
                            <Text style={styles.dailyWeatherText}>
                              {item.Night.IconPhrase}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </ScrollView>
              )}
            </View>
          </View>
        </Swiper>
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

export default withWeather(TempScreen);
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    position: "absolute",
    marginTop: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  containerWeatherList: {
    paddingTop: 20,
    flex: 1
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#EFEFEF",
    paddingVertical: 17,
    flexDirection: "row"
  },
  tableHeaderText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 13,
    color: "#373737"
  },
  tableBody: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF"
  },
  tableBodyText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 11,
    color: "#373737"
  },
  hourlyCell01: {
    width: "18%"
  },
  hourlyCell02: {
    width: "27%"
  },
  hourlyCell03: {
    width: "22%"
  },
  hourlyCell04: {
    width: "33%"
  },
  wrapper: {
    zIndex: 100
  },
  dayGradient: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
    height: 900
  },
  dayTimeGradient: {
    opacity: 0
  },
  nightTimeGradient: {
    opacity: 1
  },
  linear: {
    flex: 1
  },
  upper: {
    flex: 1,
    justifyContent: "flex-end",
    alignSelf: "center",
    zIndex: 5
  },
  lower: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25,
    zIndex: 5
  },
  lowerDgree: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-end"
    //alignSelf: 'flex-start',
    //justifyContent: 'flex-end'
  },
  tempYesterday: {
    flex: 1,
    height: 35,
    position: "absolute",
    left: 0,
    paddingRight: 10,
    width: "100%",
    bottom: -27
  },
  // tempYesterday: {
  //   flex: 1,
  //   height: 15,
  //   position: "absolute",
  //   left: 0,
  //   bottom: -9
  // },

  tempYesterdayText: {
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    fontSize: RF(2.1)
  },
  tempYesterdayTextSmall: {
    //position: "absolute",
    color: "#fff",
    fontFamily: "NanumSquareRoundEB"
    //bottom: -10,
    //left: 87
  },
  lowerEtc: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  lowerEtcWidget: {
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: "25%",
    flex: 1
  },

  lowerEtcTitle: {
    fontSize: RF(2),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginTop: 10
  },
  lowerEtcValue: {
    fontSize: RF(2),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginTop: 4
  },
  lowerEtcValue01: {
    fontSize: RF(2),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginTop: 4
  },
  currentTemp: {
    fontSize: RF(10),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB"
  },
  currentReal: {
    fontSize: RF(6),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    // marginLeft: 8,
    marginBottom: 8
  },
  currentTempDeg: {
    fontSize: RF(7),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginBottom: "13%",
    marginLeft: -5
  },
  currentRealDeg: {
    fontSize: RF(6),
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginBottom: "8%"
  },

  currentTempSmall: {
    fontSize: 49,
    color: "#fff",
    fontFamily: "NanumSquareRoundEB"
    //marginLeft: 15
  },
  currentRealSmall: {
    fontSize: 29,
    color: "#fff",
    fontFamily: "NanumSquareRoundEB"
    // marginLeft: 8,
    //marginBottom: 10
  },
  currentTempDegSmall: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginBottom: 35
    // marginLeft: 0
  },
  currentRealDegSmall: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "NanumSquareRoundEB",
    marginBottom: 16
  },

  realFeelBadge: {
    width: 61,
    height: 19,
    marginBottom: 16,
    marginLeft: 8
  },
  realFeelBadgeSmall: {
    width: 61,
    height: 19,
    marginBottom: 5,
    marginLeft: 8
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
    padding: 25
  },
  houtlyContainer: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 10,
    padding: 20,

    ...ifIphoneX(
      {
        paddingTop: 110, //iphone x style
        paddingBottom: 50
      },
      {
        paddingTop: 100, // default style
        paddingBottom: 30
      }
    ),
    ...Platform.select({
      android: {
        paddingTop: 100,
        paddingBottom: 30
      }
    })
  },
  houtlyContainerInner: {
    flex: 1,
    //justifyContent: "flex-start",
    flexDirection: "row",
    // alignItems: "flex-end",

    paddingLeft: 20,
    ...ifIphoneX(
      {
        marginBottom: 20 //iphone x style
      },
      {
        marginBottom: 45 // default style
      }
    ),
    ...Platform.select({
      android: {
        marginBottom: 45
      }
    })
  },
  houtlyContainerInner01: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 10
  },
  houtlyContainerInner02: {
    flex: 1,
    // justifyContent: "flex-start",
    // flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 10
  },
  backgroundColorinnerContainer: {
    backgroundColor: "#fff",
    flex: 7,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderRadius: 26,
    padding: 23,
    zIndex: 5
  },
  rowDaily: {
    borderBottomColor: "#EFEFEF",
    borderBottomWidth: 2,
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  dailyTemp: {
    width: 110,
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15
  },
  dailyDate: {
    fontSize: 23,
    fontFamily: "NanumSquareRoundEB"
  },
  dailyDeg: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundEB"
  },
  min: {
    position: "absolute",
    top: -13,
    right: 0,
    fontFamily: "NanumSquareRoundEB",
    color: "#A8A8A8",
    fontSize: 10,
    minWidth: 30,
    textAlign: "right"
  },
  max: {
    position: "absolute",
    top: -13,
    left: 0,
    fontFamily: "NanumSquareRoundEB",
    color: "#A8A8A8",
    fontSize: 10,
    minWidth: 30
  },
  conatinerDeg: {
    paddingTop: 16,
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  slash: {
    paddingHorizontal: 10
  },
  dailyWeather: {
    paddingLeft: 20,
    paddingTop: 15
  },
  containerHeadline: {
    borderBottomColor: "#EFEFEF",
    borderBottomWidth: 2,
    paddingVertical: 30,
    alignItems: "center"
  },
  headline: {
    fontFamily: "NanumSquareRoundEB",
    color: "#525252",
    fontSize: 11,
    width: "80%",
    textAlign: "center"
  },
  dailyWeatherText: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 15,
    paddingBottom: 10
  },
  dailyWeatherDay: {
    fontFamily: "NanumSquareRoundEB",
    color: "#A8A8A8",
    fontSize: 10
    //paddingTop: 15
  }
});
