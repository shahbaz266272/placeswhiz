import React, { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native"

import styles from "./nearbyjobs.style"
import stylex from "./welcome.style"
import { COLORS, icons, images } from "../../../constants"
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard"
import useFetch from "../../../hook/useFetch"
import AsyncStorage from "@react-native-async-storage/async-storage"
import tw from "twrnc"
import { useNotes } from "../../../contexts/NoteProvider"

const Nearbyjobs = () => {
  let newarr
  const router = useRouter()
  const { notes, setNotes } = useNotes()
  const [searchTerm, setSearchTerm] = useState("")
  const [moviesData, setmoviesData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState(false)

  const GetMovies = () => {
    setisLoading(true)
    seterror(false)
    AsyncStorage.getAllKeys()
      .then((res) => {
        AsyncStorage.multiGet(res)
          .then(async (res) => {
            const newArrayWithId = res.map(([number, jsonString]) => {
              const dataObject = JSON.parse(jsonString)
              return { id: parseFloat(number), ...dataObject }
            })
            setmoviesData(newArrayWithId)
            // Now newArrayWithId contains objects with "id" property
            setisLoading(false)
          })
          .catch((err) => {
            seterror(true)
            setisLoading(false)
          })
      })
      .catch((err) => {
        setisLoading(false)
        seterror(false)
      })
  }
  useEffect(() => {
    GetMovies()
  }, [notes?.callapi])
  const onDelete = () => {
    Alert.alert(
      "Note Deleted",
      "Your Movie has been deleted successfully!",
      [
        {
          text: "OK",
          onPress: () => GetMovies(),
        },
      ],
      { cancelable: false }
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <View>
        <View>
          <View style={stylex.container}>
            <Text style={stylex.userName}>Hello</Text>
            <Text style={tw`text-purple-500 font-semibold`}>
              Store & Find your favourite Media
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>All Media</Text>
          </View>
          {moviesData?.length < 1 ? (
            <View>
              <Text style={tw`text-center text-red-500 font-bold text-lg mt-3`}>
                Please Tap on Add Icon to add Media!
              </Text>
              {/* <Image source={images.notfound} style={tw`w-full h-[20rem]`} /> */}
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.cardsContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : error ? (
                  <Text>Something went wrong</Text>
                ) : (
                  moviesData
                    ?.filter((data) => {
                      if (searchTerm === "") {
                        return moviesData
                      } else {
                        return data?.title.includes(searchTerm)
                      }
                    })
                    ?.map((job) => (
                      <NearbyJobCard
                        job={job}
                        key={`nearby-job-${job.id}`}
                        handleNavigate={() =>
                          router.push(`/job-details/${job.id}`)
                        }
                        onDelete={() => onDelete(job.id)}
                      />
                    ))
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Nearbyjobs
