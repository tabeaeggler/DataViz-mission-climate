import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import "./climate2.css"
import { useTranslation } from "react-i18next"

function Climate2() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <div class="snow-container">
      <SnowLineOverview />
        <div class="snow foreground"></div>
        <div class="snow foreground layered"></div>
        <div class="snow middleground"></div>
        <div class="snow middleground layered"></div>
        <div class="snow background"></div>
        <div class="snow background layered"></div>
      </div>
    </React.Fragment>
  )
}

export default Climate2
