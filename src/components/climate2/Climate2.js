import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import "./climate2.css"
import Snow from "react-snowstorm"

function Climate2() {
  return (
    <React.Fragment>
      <Snow animationInterval={50} followMouse={false} vMaxY={1.5} vMaxX={3} flakesMaxActive={90} flakesMax={150}></Snow>
      <SnowLineOverview />
    </React.Fragment>
  )
}

export default Climate2
