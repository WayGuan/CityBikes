import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./components/Home";
import SocialBikes from "./components/SocialBikes";
import CameraComponent from "./components/CameraComponent";
import BarCode from "./components/BarCode";
// import { Ionicons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import HamiltonCityOpenData from "./components/HamiltonCityOpenData";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Social Bicycles') {
              iconName = 'bicycle-outline';
            }else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            }

            return <Ionicons name={iconName} size={size} />;
          },
        })}>
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Social Bicycles" component={SocialBikes} />
                <Tab.Screen name="Camera" component={CameraComponent} />
                {/* <Tab.Screen name="BarCode" component={BarCode} /> */}
              </Tab.Navigator>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
