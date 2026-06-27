import { ref, push, set,onValue } from "firebase/database"
import { db } from "./firebase"

export const addApplication = (uid, applicationData) => {
  const applicationsRef = ref(db, `applications/${uid}`)
  const newApplicationRef = push(applicationsRef)
  return set(newApplicationRef, applicationData)
}
export const subscribeToApplications = (uid, callback) => {
  const applicationsRef = ref(db, `applications/${uid}`)
  const unsubscribe = onValue(applicationsRef, (snapshot) => {
    const data = snapshot.val() || {}
    const applicationsArray = Object.entries(data).map(([key, value]) => {
      return {
        id: key,
        ...value
      }
    })
    callback(applicationsArray)
  })
  return unsubscribe
}