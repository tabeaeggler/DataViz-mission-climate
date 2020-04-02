import React from "react"
import "./App.css"
import { useTranslation } from "react-i18next"
import BasicLineGraph from "./components/test/BasicLineGraph"
import World from "./components/climate1/World"

function App() {
  const { t, i18n } = useTranslation()
  function handleClick(lang) {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="App">
      <BasicLineGraph />
      <button onClick={() => handleClick("en")}>E</button>
      <button onClick={() => handleClick("de")}>D</button>
      <button onClick={() => handleClick("fr")}>F</button>
      <button onClick={() => handleClick("it")}>I</button>
      <p>{t("Willkommen.1")}</p>
      <World></World>
    </div>
  )
}

export default App
