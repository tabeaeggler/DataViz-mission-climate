import React from "react"
import "./App.css"
import { useTranslation } from "react-i18next"
import Climate1 from "./components/climate1/Climate1"

function App() {
  const { t, i18n } = useTranslation()
  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="App">
      <button onClick={() => handleClick("en")}>E</button>
      <button onClick={() => handleClick("de")}>D</button>
      <button onClick={() => handleClick("fr")}>F</button>
      <button onClick={() => handleClick("it")}>I</button>
      <p>{t("Welcome.1")}</p>
      <Climate1 />
    </div>
  )
}

export default App
