import { Camera, CameraType } from "expo-camera";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Alert,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as MediaLibrary from "expo-media-library";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CameraComponent() {
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(0); // off
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [startCamera, setStartCamera] = useState(false);
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  // requestMediaPermission();
  useEffect(() => {
    MediaLibrary.requestPermissionsAsync();
  }, []);

  console.log("some");
  console.log(MediaLibrary.getPermissionsAsync());

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    console.log(type);
  }

  function toggleFlashMode() {
    setFlashMode((current) => (current === 0 ? 2 : 0));
    console.log(flashMode);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // console.log(type);
    // console.log(data);
    Alert.alert(
      "Bar Code Scanned",
      `${data} `,
      [
        {
          text: `Go to This Link `,
          onPress: () => Linking.openURL(data),
        },
      ],
      { cancelable: true }
    );
  };

  const CameraPreview = ({ photo, savePhoto, retakePicture }) => {
    console.log(photo);
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
            justifyContent:"flex-end"
          }}
        >
        <View style={{flexDirection: "row", justifyContent:"space-around", backgroundColor: 'rgba(39, 245, 169, 0.5)'}}>
          <Button onPress={savePhoto}>Save</Button>
          <Button onPress={retakePicture}>Retake</Button>
        </View>
        </ImageBackground>
      </View>
    );
  };

  const restartCamera = async () => {
    requestPermission();
    // console.log(permission.granted);
    if (permission.granted) {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    restartCamera();
  };

  const savePhoto = () => {
    // console.log(mediaPermission);
    MediaLibrary.saveToLibraryAsync(capturedImage.uri);
    setCapturedImage(null);
    setPreviewVisible(false);
    restartCamera();
  };

  let camera;
  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <CameraPreview
          photo={capturedImage}
          savePhoto={savePhoto}
          retakePicture={retakePicture}
        />
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flashMode}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          ref={(ref) => {
            camera = ref;
          }}
        >
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              uppercase={false}
              onPress={toggleCameraType}
            >
              {/* <Text style={styles.text}>Flip Camera</Text> */}
              <Ionicons name="camera-reverse-outline" size={24} />
            </Button>
            {/* </View>
              <View style={styles.buttonContainer}> */}
            <Button
              style={styles.button}
              uppercase={false}
              onPress={toggleFlashMode}
            >
              {/* <Text style={styles.text}>Toggle Flash</Text> */}
              <Ionicons name="flashlight-outline" size={24} />
            </Button>

            <Button
              style={styles.button}
              uppercase={false}
              onPress={async () => {
                if (!camera) return;
                const photo = await camera.takePictureAsync();
                console.log(photo);
                setPreviewVisible(true);
                setCapturedImage(photo);
              }}
            >
              {/* <Text style={styles.text}>Take picture</Text> */}
              <Ionicons name="camera-outline" size={24} />
            </Button>
          </View>
          {scanned && (
            <Button onPress={() => setScanned(false)}> Scan Again</Button>
          )}
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
