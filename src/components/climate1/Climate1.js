import React from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"


function Climate1() {
  const { t } = useTranslation()
  return (
    <div>
      <h1> {t("Climate1_Title.1")}</h1>
      <World />
      <h6>{t("Climate1_Source")}</h6>
    </div>
  )
}

export default Climate1
