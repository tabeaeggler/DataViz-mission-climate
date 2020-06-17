import React, { useContext, useEffect } from "react"
import { Context } from "./Store"
import history from "../routing/history"

function Navigation() {
  const [globalNavState, setGlobalNavState] = useContext(Context)

  useEffect(() => {
    document.getElementById("1").style.backgroundColor = "#bbb9b9"
    document.getElementById("2").style.backgroundColor = "#bbb9b9"
    document.getElementById("3").style.backgroundColor = "#bbb9b9"
    document.getElementById(globalNavState).style.backgroundColor = "#d37b61"
  })

  function handleClick(path, pageNr) {
    setGlobalNavState(pageNr)
    history.push(path)
  }

  return (
    <div className="nav-button-container">
      <button className="nav-button" id="1" onClick={() => handleClick("/", 1)}>
        1
      </button>
      <button className="nav-button" id="2" onClick={() => handleClick("/Snowline", 2)}>
        2
      </button>
      <button className="nav-button" id="3" onClick={() => handleClick("/Cause", 3)}>
        3
      </button>
    </div>
  )
}

export default Navigation
