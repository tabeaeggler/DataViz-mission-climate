import React, { useEffect, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import history from "./routing/history"
import Routes from "./routing/Routes"
import { useTranslation } from "react-i18next"
import TimeoutPopup from "./components/TimeoutPopup"
import "./App.css"

function App() {
  //translation
  const { t } = useTranslation()
  //navigation
  const [globalNavState, setGlobalNavState] = useState(0)

  /**
   * handles navigation button click
   * @param {string} path
   * @param {number} pageNr
   */
  function handleClick(path, pageNr) {
    //only past and current plus one nav points are clickable
    if (pageNr < globalNavState + 2) {
      setGlobalNavState(pageNr)
      history.push(path)
    }
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    //color navigation
    for (let index = 0; index < 5; index++) {
      if (index < globalNavState + 2) document.getElementById(index.toString()).style.backgroundColor = "#bbb9b9"
      else document.getElementById(index.toString()).style.backgroundColor = "#2d2d2e"
    }
    document.getElementById(globalNavState).style.backgroundColor = "#d37b61"
  })

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes setPageNr={setGlobalNavState} />
        <div className="nav-button-container">
          <button className="nav-button start-button" id="0" onClick={() => handleClick(process.env.PUBLIC_URL, 0)}>
            {t("Navigation.1")}
          </button>
          <button className="nav-button" id="1" onClick={() => handleClick(process.env.PUBLIC_URL + "/globe", 1)}>
            1
          </button>
          <button className="nav-button" id="2" onClick={() => handleClick(process.env.PUBLIC_URL + "/snowline", 2)}>
            2
          </button>
          <button className="nav-button" id="3" onClick={() => handleClick(process.env.PUBLIC_URL + "/cause", 3)}>
            3
          </button>
          <button className="nav-button end-button" id="4" onClick={() => handleClick(process.env.PUBLIC_URL + "/end", 4)}>
            {t("Navigation.2")}
          </button>
        </div>
        {globalNavState !== 0 ? <TimeoutPopup setPageNr={setGlobalNavState} globalNavState={globalNavState}></TimeoutPopup> : null}
      </div>
    </Router>
  )
}

export default App
