import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import history from "../routing/history"
import { CSSTransition } from "react-transition-group"
import "../App.css"

/**
 * creates start screen
 * @param {function} props.setPageNr setter for navigation
 */
const Start = props => {
  //translation
  const { t, i18n } = useTranslation()

  /**
   * handles langugage button click
   * @param {string} lang
   * @param {object} e
   */
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
   * adds next navigation button
   * @returns dom element
   */
  function navigationNext() {
    return (
      <div className="animated-nav navigation-next-button">
        <button
          onClick={() => {
            props.setPageNr(1)
            history.push(process.env.PUBLIC_URL + "/globe")
          }}>
          {createAnimation()}
        </button>
      </div>
    )
  }

  /**
   * creates language selection
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
   * creates animation of navigation button
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="89" height="89" viewBox="0 0 89 89" xmlns="http://www.w3.org/2000/svg">
        <rect width="89" height="89" rx="5" fill="#2D2D2E">
          <animate attributeName="fill" id="anim0" to="#2D2D2E" begin="1s; anim4.end" dur="1.5s" fill="freeze" />
          <animate attributeName="fill" id="anim5" to="#1A1A1B" begin="anim1.end" dur="1.5s" fill="freeze" />
        </rect>
        <path
          d="M44.5 63C34.2958 63 26 54.7042 26 44.5C26 34.2958 34.2958 26 44.5 26C54.7042 26 63 34.2958 63 44.5C63 54.7042 54.7042 63 44.5 63ZM50.8874 43.2537L43.7211 36.1263C43.3705 35.7758 42.9421 35.62 42.4747 35.62C42.0074 35.62 41.5789 35.7758 41.2285 36.1263C40.5663 36.7885 40.5663 37.9179 41.2285 38.58L47.1874 44.5L41.2674 50.42C40.6053 51.0821 40.6053 52.2115 41.2674 52.8737C41.9295 53.5358 43.0589 53.5358 43.7211 52.8737L50.8874 45.7463C51.1989 45.4347 51.3937 44.9674 51.3937 44.5C51.3937 44.0326 51.1989 43.6042 50.8874 43.2537Z"
          fill="#BBB9B9"
        />
        <animateTransform attributeName="transform" id="anim1" type="scale" additive="sum" from="1 1" to="1.5 1.5" begin="0s;anim4.end" dur="1.5s" />
        <animateTransform attributeName="transform" id="anim2" type="translate" additive="sum" from="0 0" to="-17 0" begin="0s;anim3.end" dur="1.5s" />
        <animateTransform attributeName="transform" id="anim3" type="translate" from="-26 0" to="0 0" begin="anim2.end" dur="1.5s" />
        <animateTransform attributeName="transform" id="anim4" type="scale" additive="sum" from="1.5 1.5" to="1 1" begin="anim1.end" dur="1.5s" />
      </svg>
    )
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    //initally color button with current language
    var selectedItem = document.getElementById(i18n.language)
    selectedItem.id = "language-button-clicked"
  }, [i18n])

  return (
    <React.Fragment>
      {navigationNext()}
      {createLangugageButtons()}
      <CSSTransition in={true} timeout={4000} classNames="fade" unmountOnExit appear>
        <div className="start-container">
          <p className="start-title">{t("Start.1")}</p>
          <p className="start-subtitle">{t("Start.2")}</p>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Start
