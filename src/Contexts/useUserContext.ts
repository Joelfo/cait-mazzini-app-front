import { useContext } from "react"
import { UserContext } from "./UserContext"

export function useUserContext() {
    const context = useContext(UserContext)
    if (context === undefined) {
      throw new Error("useUserContext must be within UserProvider")
    }
  
    return context
  }
  