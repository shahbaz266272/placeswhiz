import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useContext, useEffect, useState } from "react"

const NoteContext = createContext()
const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState({
    callapi: false,
  })

  return (
    <NoteContext.Provider value={{ notes, setNotes }}>
      {children}
    </NoteContext.Provider>
  )
}

export const useNotes = () => useContext(NoteContext)

export default NoteProvider
