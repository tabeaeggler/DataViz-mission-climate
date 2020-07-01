import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import ButtonRight from "../assets/img/buttonNavRight.svg"
import history from "../routing/history"
import { CSSTransition } from "react-transition-group"
import "../App.css"

const Start = props => {
  const { t, i18n } = useTranslation()

  //initally color button with current language
  useEffect(() => {
    var selectedItem = document.getElementById(i18n.language)
    selectedItem.id = "language-button-clicked"
  }, [i18n])

  //handle button clickevent
  function handleClick(lang, e) {
    //change language
    i18n.changeLanguage(lang)
    //change color of selected button
    var selectedItem = document.getElementById("language-button-clicked")
    if (selectedItem != null) {
      selectedItem.removeAttribute("id")
      selectedItem.classList.add("language-button")
    }
    e.target.id = "language-button-clicked"
  }

  /**
   * Adds next navigation button
   * @returns dom element
   */
  function navigationNext() {
    return (
      <div className="navigation-button navigation-next-button">
        <button
          onClick={() => {
            props.setPageNr(1)
            history.push("/Globe")
          }}>
          <img src={ButtonRight} alt="continue"></img>
        </button>
      </div>
    )
  }

  /**
   * Creates language selection
   * @returns dom element
   */
  function createLangugageButtons() {
    return (
      <div className="language-button-container">
        <button className="language-button" id="en" onClick={e => handleClick("en", e)}>
          E
        </button>
        <button className="language-button" id="de" onClick={e => handleClick("de", e)}>
          D
        </button>
        <button className="language-button" id="fr" onClick={e => handleClick("fr", e)}>
          F
        </button>
        <button className="language-button" id="it" onClick={e => handleClick("it", e)}>
          I
        </button>
      </div>
    )
  }

  /**
   * Creates title animation
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="120" height="120" className="start-circle">
        <path
          id="sun"
          d="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
          fill="#6a8adf">
          <animate
            id="anim1"
            attributeName="d"
            to="M90 45C90 69.8528 69.8528 90 45 90C20.1472 90 0 69.8528 0 45C0 20.1472 20.1472 0 45 0C69.8528 0 90 20.1472 90 45Z"
            begin="0s;anim4.end"
            dur="2s"
            fill="freeze"
          />
          <animate id="anim2" fill="freeze" attributeName="fill" begin="0s;anim4.end" dur="2s" to="#d37b61" />
          <animate
            id="anim3"
            attributeName="d"
            to="M100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0C77.6142 0 100 22.3858 100 50Z"
            begin="anim1.end"
            dur="2s"
            fill="freeze"
          />
          <animate id="anim4" attributeName="fill" to="#6a8adf" begin="anim1.end" dur="2s" fill="freeze" />
        </path>
      </svg>
    )
  }

  return (
    <React.Fragment>
      {navigationNext()}
      {createLangugageButtons()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="start-text">
          {t("Start")}
          {createAnimation()}
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Start
