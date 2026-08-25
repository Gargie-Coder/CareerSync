import { ref, get, set } from "firebase/database"
import { db } from "./firebase"

// Same uid-scoping convention as applications/${uid} — keeps each user's
// data isolated using the same pattern already established in this app.

export const getUserSkills = async (uid) => {
  const skillsRef = ref(db, `users/${uid}/skills`)
  const snapshot = await get(skillsRef)
  return snapshot.val() || []
}

export const setUserSkills = (uid, skillsArray) => {
  const skillsRef = ref(db, `users/${uid}/skills`)
  return set(skillsRef, skillsArray)
}
