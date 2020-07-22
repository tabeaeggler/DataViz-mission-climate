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

  /**
   * Creates title animation
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="200px" className="end-text-animation">
        <text fill="#d37b61" transform="translate(0 97.5)" font-weight="bold" fontFamily="Inconsolata" fontSize="64pt">
          <tspan>
          {t("End.2")}
            <animate id="anim1" attributeType="CSS" attributeName="font-size" from="64pt" to="80pt" dur="1.5s" begin="0s; anim2.end" />
            <animate id="anim2" attributeType="CSS" attributeName="font-size" from="80pt" to="64pt" dur="1.5s" begin="anim1.end" />
          </tspan>
        </text>
      </svg>
    )
  }

  return (
    <React.Fragment>
      {navigationBack()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="end-title-container">
          <p className="end-title">
            {t("End.1")} {createAnimation()}
          </p>
        </div>
      </CSSTransition>
      <CSSTransition in={true} timeout={3000} classNames="fade-end-text" unmountOnExit appear>
        <div className="end-text-container">
          <p className="end-subtitle-top end-subtitle">{t("End.3")}</p>
          <p className="end-subtitle">{t("End.4")}</p>
          <p className="end-subtitle">{t("End.5")}</p>
        </div>
      </CSSTransition>
      <CSSTransition in={true} timeout={5000} classNames="fade-end-text" unmountOnExit appear>
        <button
          onClick={() => {
            props.setPageNr(0)
            history.push("/")
          }}
          className="go-to-start-button">
          {t("End.6")}
        </button>
      </CSSTransition>
    </React.Fragment>
  )
}

export default End
