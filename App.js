import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootSiblingParent } from 'react-native-root-siblings';
import { createNavigationContainerRef } from "@react-navigation/native"
import ImageCaption from './components/ImageCaption';
import Dashboard from './components/Dashboard';
export default function App() {

  const theme = {
    ...DefaultTheme,
    colour: {
      ...DefaultTheme.colors,
      background: "white"
    }
  }

  const Stack = createNativeStackNavigator();


  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  async function updatePhoto(filename, type, uri) {
    console.log(filename, type, uri)
    var bodyFormData = new FormData()
    bodyFormData.append('image', { type: type, uri: uri, name: filename });
    axios({
      method: "post",
      url: `https://bdd7-2402-e280-215f-2e1-c1ff-31b5-dcbf-7609.ngrok.io/detect`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }
    )
      .then((response) => {
        console.log(response.data)
        // Toast.show({
        //   type: 'success',
        //   text1: response.data.result,
        //   visibilityTime: 1000
        // });
      }).catch((error) => {
        console.error(error.response);
        throw error
      })
  }

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      console.log(photo);
      const name = photo.uri.split("/").pop()
      updatePhoto(name.split(".")[0], name.split(".")[1], photo.uri)
      // Handle the captured photo as needed.
    }
  };

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator theme={theme} screenOptions={{ headerShown: false }} >
          <Stack.Group screenOptions={{ headerStyle: { backgroundColor: '#000000' } }} >

          <Stack.Screen name="Dashboard" component={Dashboard} />

            <Stack.Screen name="ImageCaption" component={ImageCaption}  />

          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  )
}


