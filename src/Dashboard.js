import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
} from "react-native";
import { firebase } from "../config";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";

import { debounce } from "lodash";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  // Search bar
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLocations = (loc) => {
    // console.log("location:", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      // console.log("got forecast:", data);
    });
  };

  const handleSearch = (value) => {
    // console.log("value: ", value);
    // fetch the location
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        // console.log("Got location :", data);
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "Islamabad",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;
  const changePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(firebase.auth().currentUser.email)
      .then(() => {
        alert(" Password reset email has been sent");
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("User does not exist");
        }
      });

    // Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/Images/weather.jpg")}
        style={styles.backgroundImage}
        blurRadius={2}
      >
        <View style={styles.signoutContainer}>
          <TouchableOpacity
            onPress={() => {
              firebase.auth().signOut();
            }}
            style={styles.signoutButton}
          >
            <Text style={styles.signoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Progress.CircleSnail thickness={10} size={100} color="#0bb3b2" />
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                height: "7%",
                marginHorizontal: 16,
                position: "relative",
                zIndex: 50,
              }}
            >
              <View
                style={[
                  styles.searchContainer,
                  {
                    backgroundColor: showSearch
                      ? theme.bgwhite(0.2)
                      : "transparent",
                  },
                ]}
              >
                {showSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="search city"
                    placeholderTextColor={"lightgray"}
                    style={styles.input}
                  />
                ) : null}

                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={[
                    styles.touchableOpacity,
                    { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                  ]}
                >
                  <MagnifyingGlassIcon size={25} color={"white"} />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch ? (
                <View style={styles.locationsContainer}>
                  {locations.map((loc, index) => {
                    let showBorder = index + 1 != locations.length;
                    let borderClass = showBorder
                      ? { borderBottomColor: "gray", borderBottomWidth: 1 }
                      : {};
                    return (
                      <TouchableOpacity
                        style={[styles.locationItem, borderClass]}
                        key={index}
                        // className={
                        //   "flex-row items-center border-0 px-1 mb-1" +
                        //   borderClass
                        // }
                        onPress={() => handleLocations(loc)}
                      >
                        <MapPinIcon size={20} color={"white"} />
                        <Text
                          style={{
                            color: "black",
                            fontSize: 16,
                            marginLeft: 8,
                          }}
                        >
                          {loc?.name}, {loc?.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/* forecast section */}

            <View
              style={{
                marginLeft: 4,
                marginRight: 4,
                justifyContent: "space-around",
                flex: 1,
                marginBottom: 2,
              }}
            >
              {/* location */}
              <Text style={styles.locationText}>
                {location?.name},
                <Text style={styles.countryText}>
                  {" " + location?.country}
                </Text>
              </Text>
              {/*  weather image */}
              <View style={styles.imageContainer}>
                <Image
                  source={weatherImages[current?.condition?.text]}
                  // source={{uri:'https:'+current?.condition?.icon}}
                  // source={require("../assets/Images/partly-cloudy.png")}
                  style={styles.weatherImage}
                />
              </View>
              {/* degree celsius */}
              <View style={styles.degreecontainer}>
                <Text style={styles.degreetext}> {current?.temp_c}&#176; </Text>
              </View>
              <View style={styles.degreecontainer}>
                <Text style={styles.textunderweatherimg}>
                  {current?.condition?.text}
                </Text>
              </View>
              {/* other stats */}
              <View style={styles.container}>
                <View style={styles.rowContainer}>
                  <View style={styles.iconTextContainer}>
                    <Image
                      source={require("../assets/Images/windy.png")}
                      style={styles.icon}
                    />
                    <Text style={styles.statbottomtext}>
                      {current?.wind_kph}km
                    </Text>
                  </View>
                  <View style={styles.iconTextContainer}>
                    <Image
                      source={require("../assets/Images/h2o.png")}
                      style={styles.icon}
                    />
                    <Text style={styles.statbottomtext}>
                      {current?.humidity}%
                    </Text>
                    <Image
                      source={require("../assets/Images/sun.png")}
                      style={styles.icon}
                    />
                    <Text style={styles.statbottomtext}>6:05AM</Text>
                  </View>
                </View>
              </View>
            </View>
            {/*  forecast for next days */}
            <View style={styles.Dfheadingcontainer}>
              <View style={styles.header}>
                <View style={styles.headerRow}>
                  <CalendarDaysIcon size={22} color={"white"} />
                  <Text style={styles.headerText}>Daily forecast</Text>
                </View>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={styles.forecastContainer}
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-Us", options);
                  return (
                    <View style={styles.forecastItem} key={index}>
                      <Image
                        source={weatherImages[item?.day?.condition?.text]}
                        style={styles.weatherIcon}
                      />
                      <Text style={styles.dayText}>{dayName}</Text>
                      <Text style={styles.temperature}>
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  Dfheadingcontainer: {
    marginBottom: 2,
    marginHorizontal: 5,
  },
  container: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 120,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 220,
  },

  weatherImage: {
    width: 120,
    height: 120,
  },
  countryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "lightgray",
  },
  degreecontainer: {
    marginVertical: 2,
  },
  degreetext: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 48, // Adjust the font size as needed
    color: "white",
    marginLeft: 5,
  },
  textunderweatherimg: {
    color: "white",
    fontSize: 20, // Adjust the font size as needed
    letterSpacing: 2, // Adjust the letter spacing as needed
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16, // Adjust the margin as needed
    justifyContent: "center",
  },
  icon: {
    width: 32, // Adjust the width as needed
    height: 32, // Adjust the height as needed
    paddingTop: 12, //
  },
  statbottomtext: {
    color: "white",
    fontSize: 25, // Adjust the font size as needed
    fontWeight: "bold",
    marginLeft: 16, // Adjust the margin as needed
    paddingTop: 16, // Adjust the padding as needed
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    paddingLeft: 10,
    paddingRight: 10,
    height: "100%",
    paddingBottom: 10,
    marginTop: 45,
  },
  header: {
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 2,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  forecastContainer: {
    paddingHorizontal: 15,
  },
  forecastItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 120,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  dayText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  temperature: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "white",
    height: "100%",
    paddingLeft: 10,
  },
  touchableOpacity: {
    borderRadius: 999,
    padding: 5,
    margin: 4,
  },
  locationsContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "gray",
    top: 16,
    borderRadius: 20,
    marginTop: 100,
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  signoutContainer: {
    position: "absolute",
    top: 30,
    right: 0,
    padding: 16,
  },
  signoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 20,
  },
  signoutText: {
    color: "white",
    fontSize: 16,
  },
  changepasswordButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 20,
  },
  changepasswordText: {
    color: "white",
    fontSize: 16,
  },
});

export default Dashboard;
