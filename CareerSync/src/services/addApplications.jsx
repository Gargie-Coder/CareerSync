import { ref, push, set, onValue,update } from "firebase/database"
import { db } from "./firebase"

/**
 * ARCHITECTURAL QUESTION: Why scope paths under `applications/${uid}`?
 * ANSWER: This implements data isolation. By nesting applications under the user's 
 * unique ID (UID), we guarantee that User A cannot read, overwrite, or corrupt 
 * User B's job application data. It simplifies backend security rules.
 */

/**
 * Action: Adds a brand new job application to the database.
 * @param {string} uid - The authenticated user's unique ID.
 * @param {Object} applicationData - The form data (company, role, status, etc.).
 * @returns {Promise} A promise resolving when the write operation completes.
 */
export const addApplication = (uid, applicationData) => {
  // 1. Create a reference pointer pointing to this user's specific application folder tree.
  const applicationsRef = ref(db, `applications/${uid}`)
  
  // 2. Generate a unique, auto-generated timestamp-based ID inside that folder.
  // INTERVIEW QUESTION: Why use push() instead of an index array (e.g., /0, /1)?
  // ANSWER: In distributed or multi-tab environments, sequential indexing causes overwrite 
  // collisions. push() generates highly unique keys (e.g., -NxY12b...) based on timestamps, 
  // preventing write conflicts during concurrent operations.
  const newApplicationRef = push(applicationsRef)
  
  // 3. Write the application form payload into that brand-new unique ID slot.
  return set(newApplicationRef, applicationData)
}

export const updateApplication = (uid, appId, updatedData) => {
  const applicationRef = ref(db, `applications/${uid}/${appId}`)
  return update(applicationRef, updatedData)
}

/**
 * Action: Establishes a persistent, real-time WebSocket connection to listen for data changes.
 * @param {string} uid - The authenticated user's unique ID.
 * @param {Function} callback - React state updater function to receive the parsed data array.
 * @returns {Function} An unsubscribe function to terminate the stream.
 */
export const subscribeToApplications = (uid, callback) => {
  // 1. Point to the specific location where this user's data lives.
  const applicationsRef = ref(db, `applications/${uid}`)
  
  // 2. Initialize a real-time WebSocket connection using onValue.
  // INTERVIEW QUESTION: What is the difference between a normal fetch and onValue?
  // ANSWER: An HTTP GET request fetches data once and closes. onValue creates an active 
  // subscription stream. Every single time data is modified, added, or deleted at this path, 
  // this block of code triggers instantly, automatically updating the UI.
  const unsubscribe = onValue(applicationsRef, (snapshot) => {
    // Extract the raw JSON object from Firebase's snapshot wrapper. Fallback to an empty object if null.
    const data = snapshot.val() || {}
    
    // INTERVIEW QUESTION: Why convert the object data into an array using Object.entries()?
    // ANSWER: Firebase naturally stores lists as nested JSON objects to prevent performance hits:
    // { "-NxY12b...": { company: "Google" } }
    // However, React works seamlessly with arrays for list rendering using `.map()`. 
    // This blocks maps over the object keys, injecting the Firebase key as the `id` field.
    const applicationsArray = Object.entries(data).map(([key, value]) => {
      return {
        id: key,       // Save the unique Firebase ID so we can target it later for Edit/Delete operations.
        ...value       // Spread all original fields (company, status, position, etc.)
      }
    })
    
    // 3. Send the clean, mapped array to our React component state handler.
    callback(applicationsArray)
  })
  
  // INTERVIEW QUESTION: Why are we returning the 'unsubscribe' function here?
  // ANSWER: To avoid memory leaks! If a user leaves the Dashboard component, it unmounts. 
  // If we don't call this unsubscribe function inside React's useEffect cleanup phase, the 
  // WebSocket subscription stays alive in the background forever, wasting battery, network bandwidth, and money.
  return unsubscribe
}