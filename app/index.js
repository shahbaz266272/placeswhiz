import React, { useState } from "react"
import { View, ScrollView, SafeAreaView, LogBox } from "react-native"
import { Stack, useRouter } from "expo-router"
import { COLORS, icons, images, SIZES } from "../constants"
import { Nearbyjobs, ScreenHeaderBtn } from "../components"
import { useNotes } from "../contexts/NoteProvider"
import { Image } from "react-native"
import tw from "twrnc"
// Ignore log notification by message
LogBox.ignoreLogs(["Warning: ..."])

//Ignore all log notifications
LogBox.ignoreAllLogs()
const Home = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#662E95" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "",

          headerLeft: () => (
            <Image
              source={icons.iconz}
              resizeMode="cover"
              style={tw`w-20 h-10`}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.add}
              dimension="100%"
              handlePress={() => {
                router.push(`/add-movie`)
              }}
            />
          ),
        }}
      />
      <View style={{ flex: 1, padding: SIZES.medium }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Nearbyjobs />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home
