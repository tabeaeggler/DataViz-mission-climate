import React, { useState } from "react"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import { Modal } from "react-bootstrap"
import history from "../routing/history"
import "../App.css"

/**
 * Creates the end screen of the climate presentation
 * @param {function} props.setPageNr setter for navigation 
 */
const End = props => {
  //translation
  const { t } = useTranslation()

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  /**
   * adds back navigation button
   * @returns dom element
   */
  function navigationBack() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button">
          <button
            onClick={() => {
              props.setPageNr(3)
              history.push(process.env.PUBLIC_URL + "/cause")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates title animation
   * @returns animated svg
   */
  function createAnimation() {
    return (
      <svg width="250px" className="end-text-animation">
        <text fill="#d37b61" transform="translate(0 97.5)" fontWeight="bold" fontFamily="Inconsolata" fontSize="64pt">
          <tspan>
            {t("End.2")}
            <animate id="anim1" attributeName="font-size" from="84pt" to="100pt" dur="1.5s" begin="0s; anim2.end" />
            <animate id="anim2" attributeName="font-size" from="100pt" to="84pt" dur="1.5s" begin="anim1.end" />
          </tspan>
        </text>
      </svg>
    )
  }

  /**
   * creates a modal with the "about" information
   * @returns dom element with modal
   */
  function createModal() {
    return (
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton className="about-title">
          {t("End_Modal.1")}
        </Modal.Header>
        <Modal.Body>
          <p className="about-subtitle">
            {t("End_Modal.2")}
            <br></br>
            <span className="about-text">Tabea Eggler - tabea.eggler@students.fhnw.ch</span> <br></br>
            <span className="about-text">Hannah Kühne - hannahsarah.kuehne@students.fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            {t("End_Modal.3")}
            <br></br>
            <span className="about-text">Doris Agotai - doris.agotai@fhnw.ch</span> <br></br>
            <span className="about-text">Marco Soldati - marco.soldati@fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            {t("End_Modal.4")}
            <br></br>
            <span className="about-text"> {t("End_Modal.5")}</span>
          </p>
        </Modal.Body>
      </Modal>
    )
  }

  /**
   * creates the title of the page
   * @returns dom element
   */
  function createTitle() {
    return (
      <CSSTransition in={!show} timeout={{ enter: 4000, exit: 0 }} classNames="fade" unmountOnExit appear>
        <div className="end-title-container">
          <p className="end-title">
            {t("End.1")} {createAnimation()}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates three take home messages
   * @returns dom element
   */
  function createTakeHomeMessages() {
    return (
      <CSSTransition in={!show} timeout={{ enter: 2000, exit: 0 }} classNames="fade-end-text" unmountOnExit appear>
        <div className="end-text-container">
          <p className="end-subtitle-top end-subtitle">{t("End.3")}</p>
          <p className="end-subtitle">{t("End.4")}</p>
          <p className="end-subtitle">{t("End.5")}</p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * creates "About" and "Go to Startpage" Buttons
   * @returns dom element
   */
  function createButtons() {
    return (
      <div>
        <CSSTransition in={!show} timeout={{ enter: 4500, exit: 0 }} classNames="fade-end-text" unmountOnExit appear>
          <button
            onClick={() => {
              props.setPageNr(0)
              history.push(process.env.PUBLIC_URL)
            }}
            className="go-to-start-button">
            {t("End.6")}
          </button>
        </CSSTransition>
        <div className="about-button-container">
          <button className="about-button" id={show ? "about-button-clicked" : null} onClick={() => handleShow()}>
            About
          </button>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      {navigationBack()}
      {createTitle()}
      {createTakeHomeMessages()}
      {createModal()}
      {createButtons()}
    </React.Fragment>
  )
}

export default End
