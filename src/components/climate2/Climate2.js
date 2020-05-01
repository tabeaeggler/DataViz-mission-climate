import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import "./climate2.css"
import Snow from "react-snowstorm"

function Climate2() {
  return (
    <React.Fragment>
      <Snow animationInterval={70} followMouse={false}></Snow>
      <SnowLineOverview />
    </React.Fragment>
  )
}

export default Climate2
