import React from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

/**
 * assembles all elements of climate1 screen
 */
function Climate1() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <World />
      <CSSTransition
        in={true}
        timeout={100000}
        classNames="fade"
        unmountOnExit
        appear>
        <h1 className="climate-1-title"> {t("Climate1_Title.1")}</h1>
      </CSSTransition>
      <h6 className="source">{t("Climate1_Source")}</h6>
    </React.Fragment>
  )
}

export default Climate1
