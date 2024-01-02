import { Stack, useRouter, useSearchParams } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Share,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import tw from "twrnc"
import { Rating } from "react-native-elements"

import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components"
import { COLORS, icons, SIZES } from "../../constants"
import { Image } from "react-native"

const tabs = ["About", "Qualifications", "Responsibilities"]

const JobDetails = () => {
  const params = useSearchParams()
  const [isLoading, setisLoading] = useState(false)
  const [data, setdata] = useState({})
  const [error, seterror] = useState(false)

  const router = useRouter()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    GetMovies()
    setRefreshing(false)
  }, [])

  const GetMovies = () => {
    setisLoading(true)
    seterror(false)
    AsyncStorage.getItem(params?.id)
      .then((res) => {
        setdata(JSON.parse(res))
        setisLoading(false)
      })
      .catch((err) => {
        setisLoading(false)
      })
  }
  useEffect(() => {
    GetMovies()
  }, [])
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Title: ${data.title}\nDate: ${data.date}\nRating: ${data?.ratings}\nReviews: ${data?.reviews}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error("Error sharing:", error.message)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#662E95" },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={handleShare}
            />
          ),
          headerTitle: "",
        }}
      />

      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : (
            <View style={tw`bg-white shadow-md h-full overflow-auto px-2 py-3`}>
              <Image
                source={{ uri: data?.image }}
                style={tw`w-screen rounded-lg h-[20rem] `}
              />
              <View style={tw`flex flex-row gap-2 mt-2`}>
                <Text style={tw`text-[#662E95] text-2xl font-semibold `}>
                  {data?.title}
                </Text>
              </View>
              <View style={tw`flex flex-row justify-between mt-2`}>
                <View
                  style={tw`flex flex-row gap-2  bg-[#662E95] rounded-full py-1 px-2 w-auto `}
                >
                  <Text style={tw`text-white text-xl font-semibold  `}>
                    {data?.date?.slice(0, 10)}
                  </Text>
                </View>
                <Text style={tw`text-[#662E95] text-xl font-semibold `}>
                  <Rating
                    type="heart"
                    readonly
                    ratingCount={5}
                    startingValue={data.ratings}
                    imageSize={20}
                    ratingColor={`#662E95`}
                  />
                </Text>
              </View>
              <View style={tw`flex flex-row gap-2 mt-2`}>
                <Text style={tw`text-black text-2xl font-bold `}>Genre:</Text>
                <Text style={tw`text-[#662E95] text-xl font-semibold `}>
                  {data?.genre}
                </Text>
              </View>
              <View style={tw`flex flex-row gap-2 mt-2`}>
                <Text style={tw`text-black text-2xl font-bold `}>Actors:</Text>
                <Text style={tw`text-[#662E95] text-xl font-semibold `}>
                  {data?.actors}
                </Text>
              </View>

              <View
                style={tw`flex flex-row gap-2 mt-2 bg-[#662E95] rounded-lg px-2 py-3`}
              >
                <Text style={tw`text-white text-xl font-semibold `}>
                  {data?.reviews}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </>
    </SafeAreaView>
  )
}

export default JobDetails
