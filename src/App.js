import React from "react"
import "./App.css"
import { useTranslation } from "react-i18next"
import Climate1 from "./components/climate1/Climate1"

function App() {
  const { t, i18n } = useTranslation()

  //handles translation an visual selection of button
  function handleClick(lang, e) {
    i18n.changeLanguage(lang)
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
        <button className="language-button" onClick={(e) => handleClick("en", e)}>
          E
        </button>
        <button className="language-button" onClick={(e) => handleClick("de", e)}>
          D
        </button>
        <button className="language-button" onClick={(e) => handleClick("fr", e)}>
          F
        </button>
        <button className="language-button" onClick={(e) => handleClick("it", e)}>
          I
        </button>
      </div>
    </div>
  )
}

export default App
