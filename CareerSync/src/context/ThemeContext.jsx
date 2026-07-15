import { createContext,useContext,useState,useEffect } from "react";
const ThemeContext=createContext();


export const useTheme = () => {
  return useContext(ThemeContext)
}
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

  useEffect(() => {
  if(theme==="dark"){
    document.documentElement.classList.add("dark")
  }
  else{
document.documentElement.classList.remove("dark")
  }
  localStorage.setItem("theme", theme)

  }, [theme])

  const toggleTheme = () => {
    setTheme(theme==="dark"?"light":"dark");
  }

  const value = { theme, toggleTheme }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}