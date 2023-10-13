import { View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Lottie from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';


function ImageCaption() {

  

  const [animSpeed, setAnimSpeed] = useState(false)
  const animRef = useRef()


  function playAnimation() {
    setAnimSpeed(true)
  }


  function pauseAnimation() {
    setAnimSpeed(false)
  }

  useEffect(() => {
    setTimeout(() => {
      animRef.current?.play();
    }, 100)
  }, [animSpeed])

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);

  const speak = async (text) => {

    const availableVoices = await Speech.getAvailableVoicesAsync();
    // Loop through available voices to find a female voice
    let femaleVoice = null;
    for (const voice of availableVoices) {
      if (voice.name === 'Tessa') {
        femaleVoice = voice;
        break;
      }
    }

    Speech.speak(text, {
      language: femaleVoice ? femaleVoice.language : 'en',
      voice: femaleVoice ? femaleVoice.identifier : null,
      language: 'en',
      pitch: 1.0, // Speech pitch (0.5 to 2.0)
      rate: 1.0, // Speech rate (0.1 to 2.0)
    });
  };

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
      url: `https://fc4c-45-119-28-213.ngrok.io/detect`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }
    )
      .then((response) => {
        console.log(response.data)
        speak(response.data.result)
        pauseAnimation()
        // Toast.show({
        //   type: 'success',
        //   text1: response.data.result,
        //   visibilityTime: 1000
        // });
      }).catch((error) => {
        pauseAnimation()
        speak('Unknown error occured')
        console.error(error.response);
      })
  }

  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);

  const toggleFlash = () => {
    setFlashMode((prevFlashMode) =>
      prevFlashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  const takePicture = async () => {
    if (camera) {
      playAnimation()
      let photo = await camera.takePictureAsync();
      console.log(photo);
      const name = photo.uri.split("/").pop()
      updatePhoto(name.split(".")[0], name.split(".")[1], photo.uri)
      // Handle the captured photo as needed.
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
        style={{
          position: 'absolute',
          bottom: 60,
          left: 72,
          borderRadius: 6,
          zIndex: 100,
          alignItems: 'center',
          justifyContent: 'center',

        }}>

        <MaterialIcons name="flip" size={32} color="white" />

      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          toggleFlash()
        }}
        style={{
          position: 'absolute',
          bottom: 60,
          right: 72,
          borderRadius: 6,
          zIndex: 100,
          alignItems: 'center',
          justifyContent: 'center',

        }}>
        {
          flashMode !== Camera.Constants.FlashMode.torch ?
            <Ionicons name="md-flash-outline" size={32} color="white" />
            :
            <Ionicons name="flash-off" size={32} color="white" />

        }
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => { takePicture() }}
        style={{
          position: 'absolute',
          bottom: 100,
          alignSelf: 'center',
          height: 64, width: 64, backgroundColor: 'white',
          borderRadius: 60,
          zIndex: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>

        <MaterialIcons name="camera" size={45} color="black" />

      </TouchableOpacity>

      {animSpeed &&
        <View style={{
          shadowColor: '#f5f5f5f',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 8,
          zIndex: 100,
          position: 'absolute', height: '120%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)', alignSelf: 'center', padding: 24, marginTop: 16
        }}>

          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '-40%', alignItems: 'center' }}>
            <Lottie source={require('../assets/loading_openeye.json')} style={{ height: 200, width: 200, alignSelf: 'center' }} autoPlay loop ref={animRef} speed={1} />
          </View>
          {/* <Lottie source={require('../../../assets/loading.json')} autoPlay style={{ height: 50, width: 50, alignSelf: 'center' }} loop ref={animRef} speed={1} /> */}


        </View>

      }
      <Camera
        ref={(ref) => setCamera(ref)}
        style={{ flex: 1 }}
        type={type}
        flashMode={flashMode}

      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >


        </View>
      </Camera>

      <View style={{ width: '115%', height: '35%', borderTopRightRadius: 500, borderTopLeftRadius: 500, backgroundColor: '#000000', opacity: 0.8, position: 'absolute', bottom: -170, alignSelf: 'center' }}></View>
    </View>
  );


}

export default ImageCaption