import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Platform,
  Image
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { LinearGradient } from "expo";
import { WeatherContext } from "../Context";
import { withWeather } from "../Context";
import SelectLocation from "../location";
import { ifIphoneX } from "react-native-iphone-x-helper";
import RF from "react-native-responsive-fontsize";
import i18n from "i18n-js";

class AqScreen extends React.Component {
  constructor(props) {
    super(props);

    //console.log(this.props.navigation);

    this.state = {
      widthBar: null,
      widthPM25: null,
      widthPM10: null,
      PMBackgroundColor: null,
      PMTextColor: null,
      aqIcon: null,
      aqremark: null
    };
  }

  _setAQ = () => {
    const aqCases = {
      good: {
        img: require("./../assets/images/icon-aq-good-2x.png"),
        remark: i18n.t("goodRemark")
      },
      moderate: {
        img: require("./../assets/images/icon-aq-moder-2x.png"),
        remark: i18n.t("moderRemark")
        //remark: "You can do external activities without a mask."
      },
      unfor: {
        img: require("./../assets/images/icon-aq-unfor-2x.png"),
        remark: i18n.t("unforRemark")
      },
      unhealthy: {
        img: require("./../assets/images/icon-aq-unhealth-2x.png"),
        remark: i18n.t("unhealthyRemark")
      },
      veryun: {
        img: require("./../assets/images/icon-aq-very-2x.png"),
        remark: i18n.t("veryunRemark")
      },
      hazardous: {
        img: require("./../assets/images/icon-aq-haz-2x.png"),
        remark: i18n.t("hazardousRemark")
      }
    };

    if (
      this.props.value.AQIResult === "Good" ||
      this.props.value.AQIResult === "좋음"
    ) {
      this.setState({
        aqIcon: aqCases.good.img,
        aqremark: aqCases.good.remark
      });
    }
    if (
      this.props.value.AQIResult === "Moderate" ||
      this.props.value.AQIResult === "보통"
    ) {
      this.setState({
        aqIcon: aqCases.moderate.img,
        aqremark: aqCases.moderate.remark
      });
    }
    if (
      this.props.value.AQIResult === "Unhealthy for Sensitive Groups" ||
      this.props.value.AQIResult === "민감군 안좋음"
    ) {
      this.setState({
        aqIcon: aqCases.unfor.img,
        aqremark: aqCases.unfor.remark
      });
    }
    if (
      this.props.value.AQIResult === "Unhealthy" ||
      this.props.value.AQIResult === "안좋음"
    ) {
      this.setState({
        aqIcon: aqCases.unhealthy.img,
        aqremark: aqCases.unhealthy.remark
      });
    }
    if (
      this.props.value.AQIResult === "Very Unhealthy" ||
      this.props.value.AQIResult === "매우 안좋음"
    ) {
      this.setState({
        aqIcon: aqCases.veryun.img,
        aqremark: aqCases.veryun.remark
      });
    }
    if (
      this.props.value.AQIResult === "Hazardous" ||
      this.props.value.AQIResult === "위험" ||
      this.props.value.AQIResult === "매우 위험"
    ) {
      this.setState({
        aqIcon: aqCases.hazardous.img,
        aqremark: aqCases.hazardous.remark
      });
    }
  };

  async componentDidMount() {
    this._setAQ();
    //this._setBackground();
  }

  handleTextLayout = evt => {
    console.log(evt.nativeEvent.layout.width);
    this.setState({
      widthBar: evt.nativeEvent.layout.width
    });
    this._setPM25width(evt.nativeEvent.layout.width);
  };

  // _setBackground = () => {
  //   //console.log("컬라값" + AQBack.moderate.backgroundColor);
  //   if (this.props.value.AQIResult === "Unhealthy for Sensitive Groups") {
  //     this.setState({
  //       PMBackgroundColor: "#F5B941",
  //       PMTextColor: "#fff"
  //     });
  //   } else if (this.props.value.AQIResult === "Unhealthy") {
  //     this.setState({
  //       PMBackgroundColor: "#EB3D25",
  //       PMTextColor: "#fff"
  //     });
  //   } else if (this.props.value.AQIResult === "Moderate") {
  //     this.setState({
  //       PMBackgroundColor: "#FDF753",
  //       PMTextColor: "#272727"
  //     });
  //   }
  // };

  _setPM25width = barWidth => {
    console.log("몇이 넘어왔나" + barWidth);
    this.setState({
      widthBar: barWidth,
      widthPM25:
        //JSON.stringify((100 / 500) * 100) - 6 + "%"
        (JSON.stringify((this.props.value.AQILevelResult * barWidth) / 500) /
          barWidth) *
          100 +
        "%"
      //widthPM10: (this.props.value.PM10currentAqi / barWidth) * 100 + "%"
    });
    // console.log(
    //   "AQ LEVEL!!!!!!!!!!!! WIDTH!!!! / " +
    //     (this.props.value.PM25currentAqi / barWidth) * 100
    // );
    // console.log(
    //   "AQ LEVEL!!!!!!!!!!!! WIDTH!!!!123213 / " +
    //     this.props.value.AQILevelResult
    // );
  };

  static navigationOptions = {
    title: "AQ"
  };

  render() {
    // const { navigate } = this.props.navigation;
    //console.log("!!!!", this.props);
    console.log(
      "AQ width " +
        (this.props.value.AQILevelResult / this.state.widthBar) * 100
    );
    console.log("AQ width " + this.state.widthPM25);
    return (
      <View style={styles.container}>
        <SelectLocation value={this.props} />
        <ScrollView>
          <View style={styles.AQupper}>
            <View>
              <Image
                source={this.state.aqIcon}
                style={{ width: 82, height: 82, alignSelf: "center" }}
              />
            </View>
            <View style={{ alignItems: "center", marginTop: 15 }}>
              <Text style={styles.AQINum}>
                AQI {Math.round(this.props.value.AQILevelResult)}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "NanumSquareRoundEB",
                    color: "#fff"
                  }}
                  //numberOfLines={1}
                >
                  {this.props.value.AQIResult}
                </Text>
              </View>
              <View style={styles.AQIpriContainer}>
                <Text style={styles.AQIpri}>
                  {i18n.t("Primary")} : {this.props.value.polutionStandard}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.AQPM}>
            <View
              style={{
                position: "absolute",
                height: 26,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "rgba(23,23,23,.7)",
                top: -3,
                zIndex: 100,
                left: this.state.widthPM25
              }}
            />
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                marginBottom: 5
              }}
              onLayout={this.handleTextLayout}
            >
              <View
                style={{
                  backgroundColor: "#68E143",
                  width: "10%",
                  height: 20,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderTopColor: "#B3EF9B",
                  borderTopWidth: 3,
                  borderLeftColor: "#B3EF9B",
                  borderLeftWidth: 3,
                  borderBottomColor: "#B3EF9B",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#FEFF55",
                  width: "10%",
                  height: 20,
                  borderTopColor: "#FDFAA2",
                  borderTopWidth: 3,
                  borderBottomColor: "#FDFAA2",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#EF8532",
                  width: "10%",
                  height: 20,
                  borderTopColor: "#F9D998",
                  borderTopWidth: 3,
                  borderBottomColor: "#F9D998",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#EA3323",
                  width: "10%",
                  height: 20,
                  borderTopColor: "#F49689",
                  borderTopWidth: 3,
                  borderBottomColor: "#F49689",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#854493",
                  width: "20%",
                  height: 20,
                  borderTopColor: "#BB97BD",
                  borderTopWidth: 3,
                  borderBottomColor: "#BB97BD",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#731425",
                  width: "20%",
                  height: 20,
                  borderTopColor: "#B4818C",
                  borderTopWidth: 3,
                  borderBottomColor: "#B4818C",
                  borderBottomWidth: 3
                }}
              />
              <View
                style={{
                  backgroundColor: "#731425",
                  width: "20%",
                  height: 20,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  borderTopColor: "#B4818C",
                  borderTopWidth: 3,
                  borderBottomColor: "#B4818C",
                  borderBottomWidth: 3,
                  borderRightColor: "#B4818C",
                  borderRightWidth: 3
                }}
              />
            </View>

            <View style={styles.AQstationText}>
              <Image
                source={require("./../assets/images/icon-aq-remark-2x.png")}
                style={{ width: 26, height: 19, marginBottom: 8 }}
              />
              <Text
                style={{
                  fontFamily: "NanumSquareRoundEB",
                  color: "#fff",
                  fontSize: 12,
                  textAlign: "center"
                }}
              >
                {this.state.aqremark}
              </Text>
            </View>
          </View>

          <View style={styles.AQlower}>
            <View style={styles.AQPolutionList}>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>PM 2.5</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("pm25Text")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionPM25}
                </Text>
              </View>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>PM 10</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("pm10Text")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionPM10}
                </Text>
              </View>
            </View>
            <View style={styles.AQPolutionList}>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>NO2</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("no2Text")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionN2}
                </Text>
              </View>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>SO2</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("so2Text")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionS2}
                </Text>
              </View>
            </View>
            <View style={styles.AQPolutionList}>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>CO</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("coText")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionCO}
                </Text>
              </View>
              <View style={styles.AQPolution}>
                <Text style={styles.AQPolutionTitle}>O3</Text>
                <Text style={styles.AQPolutionSubTitle}>
                  {i18n.t("o3Text")}
                </Text>
                <Text style={styles.AQPolutionData}>
                  {this.props.value.currentPositionO3}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* <Button onPress={this._LocateSetting} title="가자 좀" /> */}
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
export default withWeather(AqScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //zIndex: 99999,
    paddingTop: 105
  },
  AQupper: {
    //paddingTop: 135,
    // justifyContent: "flex-start",
    // flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    ...ifIphoneX(
      {
        paddingTop: 40, //iphone x style
        marginBottom: 20
        //height: 120
      },
      {
        paddingTop: 0, // default style
        marginBottom: 20
        //height: 100
      }
    ),
    ...Platform.select({
      android: {
        paddingTop: 0,
        marginBottom: 20
        //height: 100
      }
    })
  },
  AQlower: {
    //flex: 4
    paddingHorizontal: 20,
    marginTop: 90
  },
  AQINum: {
    fontSize: RF(7),
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQI: {
    fontSize: 19,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  // AQIindex: {
  //   backgroundColor: this.state.PMBackgroundColor,
  //   borderRadius: 30,
  //   position: "absolute",
  //   paddingVertical: 6,
  //   paddingHorizontal: 12,
  //   top: 35,
  //   left: 5
  // },
  // AQIindexText: {
  //   fontSize: 14,
  //   fontFamily: "NanumSquareRoundEB",
  //   color: "#272727"
  // },
  AQIpri: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQIpriContainer: {
    //marginTop: 38
    alignItems: "center"
  },
  AQPM: {
    marginHorizontal: 20,
    height: 26,
    marginBottom: 15
  },
  AQPMTitle: {
    fontSize: 30,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff",
    height: 37
  },
  AQPMData: {
    fontSize: 17,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQPolution: {
    width: "50%",
    alignItems: "center"
  },
  AQPolutionList: {
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 30
  },
  AQPolutionTitle: {
    fontSize: 20,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQPolutionSubTitle: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff",
    marginBottom: 6
  },
  AQPolutionData: {
    fontSize: 30,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQstationTitle: {
    fontSize: 12,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff"
  },
  AQstationText: {
    fontSize: 10,
    fontFamily: "NanumSquareRoundEB",
    color: "#fff",
    alignItems: "center",
    marginTop: 15
  }
});
