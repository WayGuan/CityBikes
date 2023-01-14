// Hamilton open data API: https://open.hamilton.ca/datasets/b5fb1c2cbccc4513ad4cac3671905ccc_18/api

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
function HamiltonCityOpenData() {
  const [data, setData] = useState([]);
  const [dataToshow, setDataToshow] = useState([]);
  const [address, setAddress] = React.useState("");
  const [emptySlotsChecked, setEmptySlotsChecked] = React.useState(false);
  const [availabilityChecked, setAvailabilityChecked] = React.useState(false);
  const [timestampChecked, setTimestampChecked] = React.useState(false);
  const [outFields, setOutFields] = useState("ADDRESS");
  //   const didMount = useRef(0); //prevent useEffect on first render

  // update the outFields parameter
  useEffect(() => {
    if (emptySlotsChecked) {
      setOutFields((prev) => prev + ",FREE_RACKS");
    } else {
      setOutFields((prev) => prev.replace(",FREE_RACKS", ""));
    }
    if (availabilityChecked) {
      setOutFields((prev) => prev + ",AVAILABLE_BIKES");
    } else {
      setOutFields((prev) => prev.replace(",AVAILABLE_BIKES", ""));
    }
    if (timestampChecked) {
      setOutFields((prev) => prev + ",LAST_IMPORT_DATE");
    } else {
      setOutFields((prev) => prev.replace(",LAST_IMPORT_DATE", ""));
    }
  }, [emptySlotsChecked, availabilityChecked, timestampChecked]);

  // fetch data on the first render
  useEffect(() => {
    // console.log(outFields);
    async function getBikes(options) {
      try {
        // available options for outFields: NAME, ADDRESS, DESCRIPTION, CURRENT_BIKES, AVAILABLE_BIKES, FREE_RACKS, RACKS_AMOUNT, LONGITUDE, LATITUDE, LAST_IMPORT_DATE
        // only the outFiled parameter is meaning for this app, other parameters are hard-coded
        const response = await axios.get(
          "https://spatialsolutions.hamilton.ca/webgis/rest/services/OpenData/Spatial_Collection_3/MapServer/18/query?where=1%3D1",
          { params: { outFields: options, outSR: "4326", f: "json" } }
        );
        //   console.log(response.data.network.stations);
        const stations = response.data.features;
        setData(stations);
        setDataToshow(stations);
        // setCompany(response.data.network.company);
      } catch (error) {
        console.error(error);
      }
    }
    getBikes(outFields);
  }, [outFields]);

  // when address changes, filter the stations
  useEffect(() => {
    if (address == "" || address == undefined) {
      setDataToshow(data);
    } else if (address != "") {
      setDataToshow(
        data.filter((item) =>
          item.attributes.ADDRESS.toLowerCase().includes(address.toLowerCase())
        )
      );
    }
  }, [address]);

  // jsx for claim items
  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.item}>
      <Text style={styles.title}>{item.attributes.ADDRESS}</Text>
      {emptySlotsChecked && (
        <Text>empty slots: {item.attributes.FREE_RACKS}</Text>
      )}
      {availabilityChecked && (
        <Text>available bikes: {item.attributes.AVAILABLE_BIKES}</Text>
      )}
      {item.attributes.LAST_IMPORT_DATE != null && (
        <Text>
          timestamp:{" "}
          {new Date(item.attributes.LAST_IMPORT_DATE)
            .toISOString()
            .substring(0, 10)}
        </Text>
      )}
    </View>
  );
  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <Text style={styles.fontSize25}>Source: Hamilton City Open Data</Text>
        <View>
          <TextInput
            label="Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.checkboxes}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Empty Slots</Text>
            <View style={styles.checkbox}>
              <Checkbox
                status={emptySlotsChecked ? "checked" : "unchecked"}
                onPress={() => {
                  setEmptySlotsChecked(!emptySlotsChecked);
                }}
                style={{ borderWidth: 1 }}
              ></Checkbox>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Availability</Text>
            <View style={styles.checkbox}>
              <Checkbox
                status={availabilityChecked ? "checked" : "unchecked"}
                onPress={() => {
                  setAvailabilityChecked(!availabilityChecked);
                }}
                style={{ borderWidth: 1 }}
              ></Checkbox>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Timestamp</Text>
            <View style={styles.checkbox}>
              <Checkbox
                status={timestampChecked ? "checked" : "unchecked"}
                onPress={() => {
                  setTimestampChecked(!timestampChecked);
                }}
                style={{ borderWidth: 1 }}
              ></Checkbox>
            </View>
          </View>
        </View>
        <FlatList
          data={dataToshow}
          renderItem={renderItem}
          // keyExtractor={(item) => item.index
        />
      </View>
    </View>
  );
}

export default HamiltonCityOpenData;

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
    fontSize: 20,
  },
  fontSize25: {
    fontSize: 22,
  },
  header: {
    flex: 1,
    paddingVertical: 20,
  },
  listContainer: {
    flex: 3,
    paddingVertical: 20,
  },
  checkboxes: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS == "ios" ? 1 : 0,
  },
  checkbox: {
    borderWidth: Platform.OS == "ios" ? 1 : 0,
  },
});
