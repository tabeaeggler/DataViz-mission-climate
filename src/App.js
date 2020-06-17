import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BrowserRouter as Router } from "react-router-dom"
import Routes from "./routing/Routes"
import Navigation from "./navigaton/Navigation"
import Store from "./navigaton/Store"
import "./App.css"

function App() {
  return (
    <Store>
      <Router>
        <div className="App">
          <Store>
            <Routes />
            <Navigation />
          </Store>
        </div>
      </Router>
    </Store>
  )
}

export default App
