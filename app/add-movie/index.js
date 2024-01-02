import React, { useState } from "react"
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { COLORS, icons } from "../../constants"
import tw from "twrnc"
import * as ImagePicker from "expo-image-picker"
import { Video } from "expo-av"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNotes } from "../../contexts/NoteProvider"
import Icon from "react-native-vector-icons/FontAwesome"

const Addjob = () => {
  const router = useRouter()
  const { setNotes } = useNotes()
  const [isLoading, setisLoading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [isUploading, setisUploading] = useState(false)
  const UploadMedia = (media, currentIndex, totalMedia) => {
    setisLoading(true)
    if (!media) {
      alert("Media file is required!")
      setisLoading(false)
    } else {
      AsyncStorage.setItem(
        Math.random().toString(),
        JSON.stringify({
          file: media,
        })
      )
        .then((_res) => {
          if (currentIndex === totalMedia - 1) {
            // This is the last media file, execute success alert and subsequent actions
            alert("All Media Uploaded Successfully!")
            setisLoading(false)
            setNotes({ callapi: Math.random() })
            router.push(`/`)
          }
        })
        .catch((err) => {
          alert(err)
          setisLoading(false)
        })
    }
  }

  const removeMedia = (index) => {
    const updatedMedia = [...mediaFiles]
    updatedMedia.splice(index, 1)
    setMediaFiles(updatedMedia)
  }

  const pickMedia = async () => {
    setisUploading(true)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Enable multiple selection
    })

    if (!result.canceled) {
      const selectedMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type,
      }))
      setMediaFiles((prevMedia) => [...prevMedia, ...selectedMedia])
      setisUploading(false)
    } else {
      setisUploading(false)
    }
  }

  const handleUpload = () => {
    const totalMedia = mediaFiles.length

    mediaFiles.forEach((media, index) => {
      UploadMedia(media, index, totalMedia)
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#662E95" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Add New Movie",
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={tw`p-4 flex flex-col gap-2`}>
          <Text style={tw`text-[#662E95] font-bold  text-lg`}>Media *</Text>
          <TouchableOpacity onPress={pickMedia}>
            <Image source={icons.gallery} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
          {isUploading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            mediaFiles.map((media, index) => (
              <View key={index} style={tw`flex-row items-center`}>
                {media.type.startsWith("image") ? (
                  <Image
                    key={index}
                    source={{ uri: media.uri }}
                    style={{
                      width: 300,
                      height: 200,
                      marginTop: 30,
                      borderRadius: 20,
                    }}
                  />
                ) : media.type.startsWith("video") ? (
                  <Video
                    key={index}
                    source={{ uri: media.uri }}
                    style={{
                      width: 300,
                      height: 200,
                      marginTop: 30,
                      borderRadius: 20,
                    }}
                    useNativeControls
                    resizeMode="contain"
                  />
                ) : (
                  <Text key={index}>Unknown File Type</Text>
                )}
                <TouchableOpacity
                  onPress={() => removeMedia(index)}
                  style={tw`relative top-0 right-0 bg-red-500 rounded-full p-2 ml-2`}
                >
                  <Icon name="close" size={20} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            ))
          )}

          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <TouchableOpacity
              disabled={isLoading}
              style={tw`bg-[#662E95] rounded-lg py-2 mt-3`}
              onPress={handleUpload}
            >
              <Text style={tw`text-white text-center text-lg`}>
                Upload Media
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Addjob
