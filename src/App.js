import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BrowserRouter as Router } from "react-router-dom"
import Routes from "./routing/Routes"
import Navigation from "./navigaton/Navigation"
import { Context } from "./navigaton/Store"
import "./App.css"

function App() {
  return (
    <Context>
      <Router>
        <div className="App">
          <Routes />
          <Navigation />
        </div>
      </Router>
    </Context>
  )
}

export default App
