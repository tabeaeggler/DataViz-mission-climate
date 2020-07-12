import React, { useEffect, useState } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import history from "./routing/history"
import Routes from "./routing/Routes"
import ButtonHome from "./assets/img/buttonHome.svg"
import ButtonGlobe from "./assets/img/buttonGlobe.svg"
import ButtonSwitzerland from "./assets/img/buttonSwitzerland.svg"
import ButtonGas from "./assets/img/buttonGas.svg"
import "./App.css"

function App() {
  const [globalNavState, setGlobalNavState] = useState(0)

  useEffect(() => {
    document.getElementById("0").style.backgroundColor = "#bbb9b9"
    document.getElementById("1").style.backgroundColor = "#bbb9b9"
    document.getElementById("2").style.backgroundColor = "#bbb9b9"
    document.getElementById("3").style.backgroundColor = "#bbb9b9"
    if (globalNavState !== 4) document.getElementById(globalNavState).style.backgroundColor = "#d37b61"
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
          <button className="nav-button" id="0" onClick={() => handleClick("/", 0)}>
            <img className="img-nav-button" src={ButtonHome} alt="home"></img>
          </button>
          <button className="nav-button" id="1" onClick={() => handleClick("/Globe", 1)}>
            <img className="img-nav-button" src={ButtonGlobe} alt="globe"></img>
          </button>
          <button className="nav-button" id="2" onClick={() => handleClick("/Snowline", 2)}>
            <img className="img-nav-button" src={ButtonSwitzerland} alt="switzerland"></img>
          </button>
          <button className="nav-button" id="3" onClick={() => handleClick("/Cause", 3)}>
            <img className="img-nav-button" src={ButtonGas} alt="gas"></img>
          </button>
        </div>
      </div>
    </Router>
  )
}

export default App
