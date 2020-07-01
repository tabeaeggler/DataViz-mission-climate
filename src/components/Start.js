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
      <svg width="261" height="261" className="start-circle">
        <path
          id="sun"
          d="M261 130.5C261 202.573 202.573 261 130.5 261C58.4268 261 0 202.573 0 130.5C0 58.4268 58.4268 0 130.5 0C202.573 0 261 58.4268 261 130.5Z"
          fill="#7589D2">
          fill="#7589D2">
          <animate id="anim1" fill="freeze" attributeName="fill" begin="0s;anim2.end+2s" dur="2s" to="#C97D6D" />
          <animate id="anim2" attributeName="fill" to="#7589D2" begin="anim1.end+2s" dur="2s" fill="freeze" />
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
          {createAnimation()}
          <br></br>
          {t("Start")}
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Start
