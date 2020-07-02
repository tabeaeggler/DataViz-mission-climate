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
      <svg width="140" height="140" className="start-circle">
        <circle cx="0" cy="0" r="45" transform="translate(70 70)" fill="#6a8adf">
          <animate attributeName="r" from="45" to="60" id="anim1" begin="0s;anim4.end+1s" dur="2s" fill="freeze" />
          <animate id="anim2" fill="freeze" attributeName="fill" begin="0s;anim4.end+1s" dur="2s" to="#d37b61" />
          <animate attributeName="r" from="60" to="45" id="anim3" begin="anim1.end+1s" dur="2s" fill="freeze" />
          <animate id="anim4" attributeName="fill" to="#6a8adf" begin="anim1.end+1s" dur="2s" fill="freeze" />
        </circle>
        <text fill="#d37b61" transform="translate(47.5 97.5)">
          ?
        </text>
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
