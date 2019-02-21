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
class PrecipScreen extends React.Component {
  static navigationOptions = {
    title: "Precip"
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
                {i18n.t("Rain")}
              </Text>
              <Text style={[styles.tableHeaderText, styles.hourlyCell03]}>
                {i18n.t("Snow")}
              </Text>
              <Text style={[styles.tableHeaderText, styles.hourlyCell04]}>
                {i18n.t("Hail")}
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
                        {item.Rain.Value}
                        {item.Rain.Unit}
                        {/* {weatherSmallImage.item.IconPhrase} */}
                      </Text>

                      <Text style={[styles.tableBodyText, styles.hourlyCell03]}>
                        {item.Snow.Value}
                        {item.Snow.Unit}
                      </Text>
                      <Text style={[styles.tableBodyText, styles.hourlyCell04]}>
                        {item.Ice.Value}
                        {item.Ice.Unit}
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

export default withWeather(PrecipScreen);
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
    width: "25%"
  },
  hourlyCell02: {
    width: "25%"
  },
  hourlyCell03: {
    width: "25%"
  },
  hourlyCell04: {
    width: "25%"
  }
});
