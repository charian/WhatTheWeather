import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Platform,
  Image,
  FlatList
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { LinearGradient } from "expo";
import { WeatherContext } from "../Context";
import { withWeather } from "../Context";
import SelectLocation from "../location";
import { ifIphoneX } from "react-native-iphone-x-helper";
import RF from "react-native-responsive-fontsize";
import Swiper from "react-native-swiper";
import i18n from "i18n-js";
class SkyScreen extends React.Component {
  static navigationOptions = {
    title: "Sky"
  };

  render() {
    //const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <SelectLocation value={this.props} />
        <View style={styles.outer}>
          <View style={styles.backgroundColorinnerContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.hourlyCell01]}>
                {i18n.t("Time")}
              </Text>
              <Text style={[styles.tableHeaderText, styles.hourlyCell02]}>
                {i18n.t("UV")}
              </Text>
              <Text style={[styles.tableHeaderText, styles.hourlyCell03]}>
                {i18n.t("CloudCover")}
              </Text>
              {/* <Text style={[styles.tableHeaderText, styles.hourlyCell04]}>
                Relative{"\n"}Humidity
              </Text> */}
              <Text style={[styles.tableHeaderText, styles.hourlyCell05]}>
                {i18n.t("DewPoint")}
              </Text>
              <Text style={[styles.tableHeaderText, styles.hourlyCell06]}>
                {i18n.t("Visibility")}
              </Text>
            </View>
            <ScrollView style={styles.containerWeatherListInner}>
              <FlatList
                data={
                  this.props.value.hourlyWeathers
                  //, this.state.hourlyWeathersIm
                }
                renderItem={({
                  item
                  //, itemIm
                }) => (
                  <View style={styles.locationList}>
                    <View style={styles.tableBody}>
                      <Text style={[styles.tableBodyText, styles.hourlyCell01]}>
                        {item.DateTime.substring(11, 16)}
                      </Text>
                      <Text style={[styles.tableBodyText, styles.hourlyCell02]}>
                        {item.UVIndex} ({item.UVIndexText})
                        {/* {weatherSmallImage.item.IconPhrase} */}
                      </Text>

                      <Text style={[styles.tableBodyText, styles.hourlyCell03]}>
                        {item.CloudCover}%
                      </Text>
                      {/* <Text style={[styles.tableBodyText, styles.hourlyCell04]}>
                        {item.RelativeHumidity}%
                      </Text> */}
                      <Text style={[styles.tableBodyText, styles.hourlyCell05]}>
                        {item.DewPoint.Value} º{item.DewPoint.Unit}
                      </Text>
                      <Text style={[styles.tableBodyText, styles.hourlyCell06]}>
                        {item.Visibility.Value}
                        {item.Visibility.Unit}
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </ScrollView>
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

export default withWeather(SkyScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //zIndex: 99999,
    paddingTop: 60
  },
  outer: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 10,
    padding: 20,

    ...ifIphoneX(
      {
        paddingTop: 60, //iphone x style
        paddingBottom: 25
      },
      {
        paddingTop: 30, // default style
        paddingBottom: 20
      }
    ),
    ...Platform.select({
      android: {
        paddingTop: 30,
        paddingBottom: 20
      }
    })
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
    //minWidth: 400
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
    width: "19%"
    //justifyContent: "center"
  },
  hourlyCell02: {
    width: "21%"
    //textAlign: "center"
  },
  hourlyCell03: {
    width: "20%"
  },
  hourlyCell04: {
    width: "20%"
  },
  hourlyCell05: {
    width: "20%"
  },
  hourlyCell06: {
    width: "20%"
  }
});
