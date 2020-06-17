import React, { useContext } from "react"
import { Context } from "./Store"
import history from "../routing/history"

function Navigation() {
  const [globalNavState, setGlobalNavState] = useContext(Context)

  function handleClick(path, pageNr) {
    console.log("state changed from", globalNavState, "to:", pageNr)
    setGlobalNavState(pageNr)
    history.push(path)
  }

  return (
    <div className="nav-button-container">
      {console.log("globalNavState", globalNavState)}
      <h6>globalNavState: {globalNavState}</h6>
      <button className="nav-button" onClick={handleClick("/", 1)}>
        1
      </button>
      <button className="nav-button" onClick={handleClick("/Snowline", 2)}>
        2
      </button>
      <button className="nav-button" onClick={handleClick("/Cause", 3)}>
        3
      </button>
    </div>
  )
}

export default Navigation

//https://www.youtube.com/watch?v=tnt2y7D3V9o
