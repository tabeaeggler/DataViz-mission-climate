import React from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

 /**
 * assembles all elements of climate1 screen
 * @param {function} props.setPageNr setter for navigation 
 */
function Climate1(props) {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <World setPageNr={props.setPageNr} />
      <CSSTransition in={true} timeout={500} classNames="fade" unmountOnExit appear>
        <div>
          <h1 className="climate-1-title"> {t("Climate1_Title.1")}</h1>
          <h2 className="subtitle climate-1-subtitle">{t("Climate1_Title.2")}</h2>
          <h6 className="source">{t("Climate1_Source")}</h6>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate1
