import React from "react"
import SnowLine from "./SnowLineDraggable"
import "./climate2.css"
import { useTranslation } from "react-i18next"

function Climate2() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <SnowLine />
    </React.Fragment>
  )
}

export default Climate2
