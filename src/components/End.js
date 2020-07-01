import React from "react"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import history from "../routing/history"
import "../App.css"

function End() {
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
              history.push("/Climate")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Creates title animation
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="100" height="120">
      </svg>
    )
  }

  return (
    <React.Fragment>
      {navigationBack()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="end-text-container">
          {createAnimation()}
          <p className="end-text-title">{t("End.1")}</p>
          <p className="end-text-subtitle1">{ t("End.2")}</p>
          <p className="end-text-subtitle2">{t("End.3")}</p>
          <p className="end-text-subtitle2">{t("End.4")}</p>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default End
