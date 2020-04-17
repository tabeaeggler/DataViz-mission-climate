import React, { useEffect } from "react"
import "./App.css"
import { useTranslation } from "react-i18next"
import Climate1 from "./components/climate1/Climate1"

function App() {
  const { t, i18n } = useTranslation()

  //initally color button with current language
  useEffect(() => {
    var selectedItem = document.getElementById(i18n.language)
    selectedItem.id = "language-button-clicked"

  }, [])

  //handle button clickevent
  function handleClick(lang, e) {
    //change language
    i18n.changeLanguage(lang)

    //change color of selected button
    var selectedItem = document.getElementById("language-button-clicked")
    if (selectedItem != null) {
      selectedItem.removeAttribute("id")
      selectedItem.classList.add("language-button")
    }
    e.target.id = "language-button-clicked"
  }

  return (
    <div className="App">
      <Climate1 />
      <div className="language-button-container">
        <button
          className="language-button"
          id="en"
          onClick={e => handleClick("en", e)}>
          E
        </button>
        <button
          className="language-button"
          id="de"
          onClick={e => handleClick("de", e)}>
          D
        </button>
        <button
          className="language-button"
          id="fr"
          onClick={e => handleClick("fr", e)}>
          F
        </button>
        <button
          className="language-button"
          id="it"
          onClick={e => handleClick("it", e)}>
          I
        </button>
      </div>
    </div>
  )
}

export default App
