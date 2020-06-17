import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BrowserRouter as Router } from "react-router-dom"
import Routes from "./routing/Routes"
import history from "./routing/history"
import "./App.css"

function App() {
  //handle button clickevent
  function handleClick(path, e) {
    //change page
    history.push(path)
    //change color of selected button
    var selectedItem = document.getElementById("nav-button-clicked")
    if (selectedItem != null) {
      selectedItem.removeAttribute("id")
      selectedItem.classList.add("nav-button")
    }
    e.target.id = "nav-button-clicked"
  }

  return (
    <Router>
      <div className="App">
        <Routes />
        <div className="nav-button-container">
          <button className="nav-button" id="nav-button-clicked" onClick={e => handleClick("/", e)}>
            1
          </button>
          <button className="nav-button" onClick={e => handleClick("/Snowline", e)}>
            2
          </button>
          <button className="nav-button" onClick={e => handleClick("/Cause", e)}>
            3
          </button>
        </div>
      </div>
    </Router>
  )
}

export default App
