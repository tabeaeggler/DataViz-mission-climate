import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import "./climate2.css"
import { useTranslation } from "react-i18next"

function Climate2() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <SnowLineOverview />
    </React.Fragment>
  )
}

export default Climate2
