import React from "react"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import "../App.css"

const End = props => {
  const { t } = useTranslation()

  /**
   * Adds back navigation button
   * @returns dom element
   */
  function navigationBack() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button">
          <button
            onClick={() => {
              props.setPageNr(3)
              history.push("/Cause")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      {navigationBack()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="end-text-container">
          <p className="end-text-title">{t("End.1")}</p>
          <p className="end-text-subtitle1">{t("End.2")}</p>
          <p className="end-text-subtitle2">{t("End.3")}</p>
          <p className="end-text-subtitle2">{t("End.4")}</p>
        </div>
      </CSSTransition>
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <button
          onClick={() => {
            props.setPageNr(0)
            history.push("/")
          }}
          className="go-to-start-button">
          {t("End.5")}
        </button>
      </CSSTransition>
    </React.Fragment>
  )
}

export default End
