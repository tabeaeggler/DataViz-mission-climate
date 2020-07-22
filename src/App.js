import React, { useEffect, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import history from "./routing/history"
import Routes from "./routing/Routes"
import { useTranslation } from "react-i18next"
import "./App.css"

function App() {
  //translation
  const { t } = useTranslation()
  const [globalNavState, setGlobalNavState] = useState(0)

  useEffect(() => {
    document.getElementById("0").style.backgroundColor = "#bbb9b9"
    document.getElementById("1").style.backgroundColor = "#bbb9b9"
    document.getElementById("2").style.backgroundColor = "#bbb9b9"
    document.getElementById("3").style.backgroundColor = "#bbb9b9"
    document.getElementById("4").style.backgroundColor = "#bbb9b9"
    document.getElementById(globalNavState).style.backgroundColor = "#d37b61"
  })

  function handleClick(path, pageNr) {
    setGlobalNavState(pageNr)
    history.push(path)
  }

  return (
    <Router>
      <div className="App">
        <Routes setPageNr={setGlobalNavState} />
        <div className="nav-button-container">
          <button className="nav-button start-button" id="0" onClick={() => handleClick("/", 0)}>
            <span className="start-button-text">{t("Navigation.1")}</span>
          </button>
          <button className="nav-button" id="1" onClick={() => handleClick("/Globe", 1)}>
            1
          </button>
          <button className="nav-button" id="2" onClick={() => handleClick("/Snowline", 2)}>
            2
          </button>
          <button className="nav-button" id="3" onClick={() => handleClick("/Cause", 3)}>
            3
          </button>
          <button className="nav-button end-button" id="4" onClick={() => handleClick("/End", 4)}>
            {t("Navigation.2")}
          </button>
        </div>
      </div>
    </Router>
  )
}

export default App
