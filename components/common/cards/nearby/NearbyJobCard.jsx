import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"
import { Rating } from "react-native-elements"
import { Video } from "expo-av"
import Swipeout from "react-native-swipeout"
import AsyncStorage from "@react-native-async-storage/async-storage"
import tw from "twrnc"
import Modal from "react-native-modal"
import Icon from "react-native-vector-icons/FontAwesome"

const NearbyJobCard = ({ job, handleNavigate, onDelete }) => {
  const [isModalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  const deleteNote = async () => {
    await AsyncStorage.removeItem(job?.id?.toString())
    onDelete()
  }

  const displayDeleteAlert = () => {
    Alert.alert(
      "Are You Sure!",
      "This action will delete your Media permanently!",
      [
        {
          text: "Delete",
          onPress: () => {
            deleteNote()
            // Trigger the onDelete function passed from the parent
          },
        },
        {
          text: "No Thanks",
          onPress: () => console.log("no thanks"),
        },
      ],
      {
        cancelable: true,
      }
    )
  }

  const swipeoutBtns = [
    {
      text: "Delete",
      backgroundColor: "red",
      style: { borderRadius: 30 },
      onPress: displayDeleteAlert,
    },
  ]

  return (
    <>
      <Swipeout right={swipeoutBtns} autoClose={true} backgroundColor="#fff">
        {job?.file?.type.startsWith("image") ? (
          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={{ uri: job.file?.uri }}
              style={tw`w-full h-[10rem] my-3 shadow-xl`}
            />
          </TouchableOpacity>
        ) : job?.file?.type.startsWith("video") ? (
          <Video
            source={{ uri: job.file?.uri }}
            style={tw`w-full h-[10rem] my-3 shadow-xl`}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <Text>Unknown File Type</Text>
        )}
      </Swipeout>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={{ flex: 1 }}>
          <Image source={{ uri: job.file?.uri }} style={tw`flex-1`} />
        </View>
        <TouchableOpacity
          style={tw`absolute top-2 right-2 bg-green-500 rounded-full p-2`}
          onPress={toggleModal}
        >
          <Icon name="times" size={30} color="red" />
        </TouchableOpacity>
      </Modal>
    </>
  )
}

export default NearbyJobCard
