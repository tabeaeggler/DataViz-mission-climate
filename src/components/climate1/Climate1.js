import React, { useEffect, useState, useRef } from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"


function Climate1() {
  const { t } = useTranslation()


  return (
    <React.Fragment>

      <h1 className="climate-1-title"> {t("Climate1_Title.1")}</h1>
      <World />
    </React.Fragment>
  )
}

export default Climate1
