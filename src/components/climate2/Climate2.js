import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import "./climate2.css"
import { useTranslation } from "react-i18next"
import Snow from "react-snowstorm"

function Climate2() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Snow animationInterval={70} followMouse={false}></Snow>
      <SnowLineOverview />
    </React.Fragment>
  )
}

export default Climate2
