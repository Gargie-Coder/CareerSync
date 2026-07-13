export const getAuthErrorMessage = (errorCode) => {
  const messages = {
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/user-not-found": "No account found with this email.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-credential": "Incorrect email or password.",
  }
  return messages[errorCode] || "Something went wrong. Please try again."
}