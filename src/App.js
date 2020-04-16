import React from "react"
import "./App.css"
import { useTranslation } from "react-i18next"
import Climate1 from "./components/climate1/Climate1"

function App() {
  const { t, i18n } = useTranslation()
  function handleClick(lang, e) {
    i18n.changeLanguage(lang)
    var selectedItem = document.getElementsByClassName("language-button-clicked")
    console.log(selectedItem)

    if (selectedItem.length != 0) { 
      selectedItem.classList.remove("language-button-clicked")
      selectedItem.classList.add("language-button")
    }
    e.target.className = "language-button-clicked"
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
