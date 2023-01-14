import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import MapView, { Callout, Marker } from "react-native-maps";

const windowWidth = Dimensions.get("window").width;
function SocialBikes() {
  const [data, setData] = useState([]);
  const [dataToshow, setDataToshow] = useState([]);
  const [company, setCompany] = useState();
  const [address, setAddress] = React.useState("");
  const [showMap, setShowMap] = useState(true);

  // fetch data on the first render
  useEffect(() => {
    async function getBikes() {
      try {
        const response = await axios.get(
          "https://api.citybik.es/v2/networks/sobi-hamilton"
        );
        const stations = response.data.network.stations;
        setData(stations);
        setDataToshow(stations);
        setCompany(response.data.network.company);
      } catch (error) {
        console.error(error);
      }
    }
    getBikes();
  }, []);

  // when address changes, filter the stations
  useEffect(() => {
    if (address == "" || address == undefined) {
      setDataToshow(data);
    } else if (address != "") {
      setDataToshow(
        data.filter((item) =>
          item.extra.address.toLowerCase().includes(address.toLowerCase())
        )
      );
    }
  }, [address]);

  // jsx for claim items
  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.item}>
      <Text style={styles.title}>{item.extra.address}</Text>
      <Text>empty slots: {item.empty_slots}</Text>
      <Text>available bikes: {item.free_bikes}</Text>
      <Text>timestamp: {item.timestamp.substring(0, 10)}</Text>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.fontSize20}>Source: {company}</Text>
        <View>
          <TextInput
            label="Search Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
          <View style={styles.buttonsContainer}>
            <Text>Availability:</Text>
            <Button
              mode="contained"
              onPress={() => {
                setDataToshow(data.filter((item) => item.free_bikes > 10));
                setAddress("");
              }}
            >
              {"> 10"}
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setDataToshow(data.filter((item) => item.free_bikes > 0));
                setAddress("");
              }}
            >
              {"> 0"}
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setDataToshow(data);
                setAddress("");
              }}
            >
              {"All"}
            </Button>
          </View>
        </View>
        {/* </View>
      <View style={styles.listContainer}> */}
        <View style={styles.buttonsContainer}>
          <Text>Options:</Text>
          <Button mode="contained" onPress={() => setShowMap(true)}>
            {"Map"}
          </Button>
          <Button mode="contained" onPress={() => setShowMap(false)}>
            {"List"}
          </Button>
        </View>
        {showMap && (
          <MapView
            initialRegion={{
              latitude: 43.25643601915583,
              longitude: -79.86929655075073,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{ height: 300, width: windowWidth }}
          >
            {dataToshow.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
                description={
                  marker.extra.address +
                  ".  Available bikes: " +
                  marker.free_bikes
                }
              />
            ))}
          </MapView>
        )}

        {!showMap && (
          <FlatList
            data={dataToshow}
            renderItem={renderItem}
            // keyExtractor={(item) => item.index
          />
        )}
      </View>
    </View>
  );
}

export default SocialBikes;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  title: {
    fontSize: 18,
  },
  fontSize20: {
    fontSize: 20,
  },
  header: {
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 5,
    width: windowWidth * 0.95,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  listContainer: {
    flex: 3,
    paddingVertical: 20,
  },
});
