import React from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"


function Climate1() {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="climate-1-title"> {t("Climate1_Title.1")}</h1>
      <World />
    </div>
  )
}

export default Climate1
