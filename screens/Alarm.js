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
import { DrawerActions } from "react-navigation";
import { LinearGradient } from "expo";
import SelectLocation from "../location";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { WeatherContext } from "../Context";
import i18n from "i18n-js";

class AlarmScreen extends React.Component {
  static navigationOptions = {
    title: "Alarm"
  };

  render() {
    //const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <SelectLocation value={this.props} />
        <View style={{ marginTop: 50 }}>
          <Text style={styles.alarm}>곧 추가됩니다!</Text>
          <Text style={styles.alarmRemark} />
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
export default () => (
  <WeatherContext.Consumer>
    {value => <AlarmScreen value={value} />}
  </WeatherContext.Consumer>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //zIndex: 99999,
    paddingTop: 60
  },
  alarm: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff"
  },
  alarmRemark: {
    fontFamily: "NanumSquareRoundEB",
    fontSize: 15,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#fff"
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
  }
});
