import React, { useContext, useEffect } from "react"
import { Context } from "./Store"
import history from "../routing/history"
import { gray } from "d3"

function Navigation() {
  const [globalNavState, setGlobalNavState] = useContext(Context)

  useEffect(() => {
    var bu
    document.getElementById("1").style.backgroundColor = "gray"
    document.getElementById("2").style.backgroundColor = "gray"
    document.getElementById("3").style.backgroundColor = "gray"
    document.getElementById(globalNavState).style.backgroundColor = "red"
  })

  function handleClick(path, pageNr) {
    console.log("state changed from", globalNavState, "to:", pageNr)
    setGlobalNavState(pageNr)
    history.push(path)
  }

  return (
    <div className="nav-button-container">
      {console.log("globalNavState", globalNavState)}
      <h6>globalNavState: {globalNavState}</h6>
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

//https://www.youtube.com/watch?v=tnt2y7D3V9o
