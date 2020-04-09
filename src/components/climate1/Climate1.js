import React from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"
import InfoboxNavigation from "./InfoboxNavigation"

function Climate1() {
  const { t } = useTranslation()
  return (
    <div>
      <h1> {t("Climate1_Title.1")}</h1>
      <World />
      <InfoboxNavigation upperLimit={2} textIdentifier={"Climate1_Textbox."}/>
    </div>
  )
}

export default Climate1
