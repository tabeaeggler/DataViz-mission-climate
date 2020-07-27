import React, { useState } from "react"
import ButtonLeft from "../assets/img/buttonNavLeft.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import { Modal } from "react-bootstrap"
import history from "../routing/history"
import "../App.css"

const End = props => {
  //translation
  const { t } = useTranslation()

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => setShow(true)

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
        <text fill="#d37b61" transform="translate(0 97.5)" fontWeight="bold" fontFamily="Inconsolata" fontSize="64pt">
          <tspan>
            {t("End.2")}
            <animate id="anim1" attributeName="font-size" from="64pt" to="80pt" dur="1.5s" begin="0s; anim2.end" />
            <animate id="anim2" attributeName="font-size" from="80pt" to="64pt" dur="1.5s" begin="anim1.end" />
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
      <div className="about-button-container">
        <button
          className="about-button"
          id={show ? "about-button-clicked" : null}
          onClick={e => {
            handleShow()
          }}>
          About
        </button>
      </div>
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton className="about-title">
          Bachelor Arbeit - Mission Klima und Wetter
        </Modal.Header>
        <Modal.Body
          style={{
            width: 820,
          }}>
          <p className="about-subtitle">
            Projektteam <br></br>
            <span className="about-text">Tabea Eggler - tabea.eggler@students.fhnw.ch</span> <br></br>
            <span className="about-text">Hannah Kühne - hannahsarah.kuehne@students.fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            Betreuende <br></br>
            <span className="about-text">Doris Agotai - doris.agotai@fhnw.ch</span> <br></br>
            <span className="about-text">Marco Soldati - marco.soldati@fhnw.ch</span>
          </p>
          <p className="about-subtitle">
            Kunde <br></br>
            <span className="about-text">Verkehrshaus Luzern</span>
          </p>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default End
